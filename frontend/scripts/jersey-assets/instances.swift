import Vision
import CoreImage
import AppKit
let a = CommandLine.arguments
let src = NSImage(contentsOfFile: a[1])!
var r = CGRect(origin: .zero, size: src.size)
let cg = src.cgImage(forProposedRect: &r, context: nil, hints: nil)!
let handler = VNImageRequestHandler(cgImage: cg)
let req = VNGenerateForegroundInstanceMaskRequest()
try! handler.perform([req])
let obs = req.results!.first!
print("instances:", Array(obs.allInstances))
let ctx = CIContext()
for inst in obs.allInstances {
  let buf = try! obs.generateMaskedImage(ofInstances: IndexSet(integer: inst), from: handler, croppedToInstancesExtent: false)
  let ci = CIImage(cvPixelBuffer: buf)
  try! ctx.writePNGRepresentation(of: ci, to: URL(fileURLWithPath: "\(a[2])/inst-\(inst).png"), format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
  // bounding box of alpha
  let rep = NSBitmapImageRep(ciImage: ci)
  var minX = Int.max, maxX = 0, minY = Int.max, maxY = 0
  for y in stride(from: 0, to: rep.pixelsHigh, by: 2) { for x in stride(from: 0, to: rep.pixelsWide, by: 2) {
    if rep.colorAt(x: x, y: y)!.alphaComponent > 0.5 { minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y) } } }
  print("inst", inst, "bbox x:", minX, maxX, "y:", minY, maxY)
}
