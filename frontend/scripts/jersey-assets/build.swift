// Builds front + back jersey textures from the single reference photo.
// usage: build <source.png> <mask.png (alpha = both jerseys)> <outDir>
import AppKit

struct RGBA { var r: UInt8; var g: UInt8; var b: UInt8; var a: UInt8 }

final class Bitmap {
  let w: Int, h: Int
  var px: [RGBA]
  init(w: Int, h: Int) { self.w = w; self.h = h; px = Array(repeating: RGBA(r: 0, g: 0, b: 0, a: 0), count: w * h) }
  init(cg: CGImage) {
    w = cg.width; h = cg.height
    px = Array(repeating: RGBA(r: 0, g: 0, b: 0, a: 0), count: w * h)
    let ctx = CGContext(data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                        space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))
  }
  // y = 0 is the TOP row (CGContext memory layout is top-down for this setup)
  subscript(x: Int, y: Int) -> RGBA {
    get { (x < 0 || y < 0 || x >= w || y >= h) ? RGBA(r: 0, g: 0, b: 0, a: 0) : px[y * w + x] }
    set { if x >= 0 && y >= 0 && x < w && y < h { px[y * w + x] = newValue } }
  }
  func cgImage() -> CGImage {
    var copy = px
    let ctx = CGContext(data: &copy, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                        space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    return ctx.makeImage()!
  }
}

func load(_ path: String) -> CGImage {
  let img = NSImage(contentsOfFile: path)!
  var r = CGRect(origin: .zero, size: img.size)
  return img.cgImage(forProposedRect: &r, context: nil, hints: nil)!
}

func save(_ cg: CGImage, _ path: String) {
  let rep = NSBitmapImageRep(cgImage: cg)
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: path))
}

let args = CommandLine.arguments
let src = Bitmap(cg: load(args[1]))
let mask = Bitmap(cg: load(args[2]))
let out = args[3]
let W = src.w, H = src.h

// ── 1. Separate Home (front, yellow) from Away by flood-filling "non-blue" pixels ──
func isBlue(_ p: RGBA) -> Bool { Int(p.b) > Int(p.r) + 15 && Int(p.b) >= Int(p.g) }
var home = [Bool](repeating: false, count: W * H)
var stack = [(321, 600)]
while let (x, y) = stack.popLast() {
  if x < 0 || y < 0 || x >= W || y >= H || x > 600 { continue }
  let i = y * W + x
  if home[i] || mask[x, y].a < 100 || isBlue(src[x, y]) { continue }
  home[i] = true
  stack.append(contentsOf: [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
}
// dilate the home mask a little (anti-aliased edge pixels)
var homeDil = home
for y in 1..<(H - 1) { for x in 1..<(W - 1) where home[y * W + x] {
  for dy in -2...2 { for dx in -2...2 { let xx = x + dx, yy = y + dy; if xx >= 0 && yy >= 0 && xx < W && yy < H { homeDil[yy * W + xx] = true } } }
} }

func withMaskAlpha(_ p: RGBA, _ a: UInt8) -> RGBA {
  // source is opaque; apply alpha with premultiplication
  let f = Double(a) / 255
  return RGBA(r: UInt8(Double(p.r) * f), g: UInt8(Double(p.g) * f), b: UInt8(Double(p.b) * f), a: a)
}

let homeImg = Bitmap(w: W, h: H)
let awayImg = Bitmap(w: W, h: H)
for y in 0..<H { for x in 0..<W {
  let m = mask[x, y].a
  if m == 0 { continue }
  if home[y * W + x] { homeImg[x, y] = withMaskAlpha(src[x, y], m) }
  else if !homeDil[y * W + x] && x > 440 { awayImg[x, y] = withMaskAlpha(src[x, y], m) }
} }

// ── 2. Rebuild Away's hidden left side from its mirrored right side (axis x = 698) ──
let awayAxis = 698
for y in 0..<H { for x in 0..<awayAxis {
  let hidden = homeDil[y * W + x]
  if hidden || awayImg[x, y].a == 0 {
    let mx = 2 * awayAxis - x
    if mx < W, mask[mx, y].a > 0, !homeDil[y * W + mx] {
      // only rebuild where the mirrored pixel is Away fabric (not the Home jersey)
      awayImg[x, y] = withMaskAlpha(src[mx, y], mask[mx, y].a)
    }
  }
} }

// ── 3. Crop each jersey symmetrically around its axis so front/back silhouettes line up ──
struct Spec { let name: String; let img: Bitmap; let axis: Int; let crest: (Int, Int); let neck: (l: Int, r: Int, top: Int, apex: Int) }
let specs = [
  Spec(name: "home", img: homeImg, axis: 321, crest: (412, 348), neck: (232, 410, 182, 268)),
  Spec(name: "away", img: awayImg, axis: 698, crest: (790, 348), neck: (608, 787, 183, 272)),
]

for s in specs {
  var minY = H, maxY = 0, half = 0
  for y in 0..<H { for x in 0..<W where s.img[x, y].a > 10 {
    minY = min(minY, y); maxY = max(maxY, y); half = max(half, abs(x - s.axis))
  } }
  half += 6
  let x0 = s.axis - half, y0 = minY - 6, cw = half * 2, ch = maxY - minY + 12
  let front = Bitmap(w: cw, h: ch)
  for y in 0..<ch { for x in 0..<cw { front[x, y] = s.img[x0 + x, y0 + y] } }
  save(front.cgImage(), "\(out)/\(s.name)-front.png")

  // ── 4. Back view: hide the crest, close the V-neck, add a back collar, then mirror ──
  let back = Bitmap(w: cw, h: ch)
  for y in 0..<ch { for x in 0..<cw { back[x, y] = front[x, y] } }
  let shift = 150 // fabric below has the same stripe/pattern columns
  let cx = s.crest.0 - x0, cy = s.crest.1 - y0
  for y in (cy - 54)...(cy + 54) { for x in (cx - 54)...(cx + 54) {
    let d = hypot(Double(x - cx), Double(y - cy))
    if d > 54 { continue }
    let t = d < 45 ? 1.0 : (54 - d) / 9 // feathered edge
    let a = back[x, y], b = front[x, y + shift]
    func mix(_ p: UInt8, _ q: UInt8) -> UInt8 { UInt8(Double(p) * (1 - t) + Double(q) * t) }
    back[x, y] = RGBA(r: mix(a.r, b.r), g: mix(a.g, b.g), b: mix(a.b, b.b), a: a.a)
  } }

  let nl = s.neck.l - x0, nr = s.neck.r - x0, nTop = s.neck.top - y0, nApex = s.neck.apex - y0
  let ax = s.axis - x0
  // back collar curve: shallow dip between the shoulder points
  func collarY(_ x: Int) -> Double {
    let t = Double(x - nl) / Double(nr - nl) * 2 - 1
    return Double(nTop) + 9 * (1 - t * t) - 4
  }
  for x in max(0, nl - 4)...min(cw - 1, nr + 4) {
    let cyx = collarY(x)
    for y in max(0, nTop - 26)...min(ch - 1, nApex + 16) {
      let yy = Double(y)
      if yy < cyx {
        // above the new collar: open neck (transparent) inside the neck span
        if x > nl + 2 && x < nr - 2 { back[x, y] = RGBA(r: 0, g: 0, b: 0, a: 0) }
      } else if y <= nApex + 16 {
        // inside the old V (and its collar band): replace with body fabric from below
        let vHalf = Double(nr - nl) / 2 * max(0, 1 - (yy - Double(nTop)) / Double(nApex + 18 - nTop)) + 18
        if abs(Double(x - ax)) < vHalf {
          back[x, y] = front[x, y + 270]
        }
      }
    }
  }
  // collar band
  let bandColors: [(Double, Double, RGBA)] = s.name == "home"
    ? [(0, 6, RGBA(r: 232, g: 186, b: 22, a: 255)), (6, 9, RGBA(r: 24, g: 22, b: 20, a: 255))]
    : [(0, 3.5, RGBA(r: 205, g: 38, b: 44, a: 255)), (3.5, 6.5, RGBA(r: 245, g: 245, b: 245, a: 255)), (6.5, 10, RGBA(r: 205, g: 38, b: 44, a: 255))]
  for x in (nl + 1)...(nr - 1) {
    let c = collarY(x)
    for (from, to, col) in bandColors {
      for y in Int(c + from)..<Int(ceil(c + to)) { back[x, y] = col }
    }
  }

  // mirror horizontally: the back is the front silhouette seen from behind
  let mirrored = Bitmap(w: cw, h: ch)
  for y in 0..<ch { for x in 0..<cw { mirrored[x, y] = back[cw - 1 - x, y] } }

  // print "MALAYSIA" across the upper back
  let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: cw, pixelsHigh: ch, bitsPerSample: 8, samplesPerPixel: 4,
                              hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
  rep.size = NSSize(width: cw, height: ch)
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
  NSGraphicsContext.current!.cgContext.draw(mirrored.cgImage(), in: CGRect(x: 0, y: 0, width: cw, height: ch))
  let font = NSFont(name: "Futura-CondensedExtraBold", size: 46) ?? NSFont.boldSystemFont(ofSize: 44)
  let ink = s.name == "home" ? NSColor(calibratedRed: 0.07, green: 0.07, blue: 0.07, alpha: 0.92) : NSColor(calibratedRed: 1, green: 0.78, blue: 0.16, alpha: 0.95)
  let para = NSMutableParagraphStyle(); para.alignment = .center
  let text = NSAttributedString(string: "MALAYSIA", attributes: [.font: font, .foregroundColor: ink, .kern: 5, .paragraphStyle: para])
  text.draw(in: NSRect(x: 0, y: CGFloat(ch) - CGFloat(nTop + 120), width: CGFloat(cw), height: 60))
  NSGraphicsContext.restoreGraphicsState()
  save(rep.cgImage!, "\(out)/\(s.name)-back.png")

  print(s.name, "crop", cw, "x", ch)
}
