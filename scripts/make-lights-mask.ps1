param()
# Generates a transparent light-mask PNG containing ONLY the bright white
# angel-eye pixels of the BMW front intro image. Blue grille, dark body and
# blue accents are dropped. Output aligns 1:1 with the source so it can be
# overlaid with identical object-fit: cover.

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"

$root = Split-Path $PSScriptRoot -Parent
$srcPath = Join-Path $root "autocentar-bimmer-assets\intro-bmw.png"
$outPath = Join-Path $root "autocentar-bimmer-assets\intro-lights.png"

$src = New-Object System.Drawing.Bitmap $srcPath
$w = $src.Width; $h = $src.Height
$rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
$fmt = [System.Drawing.Imaging.PixelFormat]::Format32bppArgb

# --- Read source bytes (BGRA) ---
$rd = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, $fmt)
$stride = $rd.Stride
$buf = New-Object byte[] ($stride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($rd.Scan0, $buf, 0, $buf.Length)
$src.UnlockBits($rd)

$out = New-Object byte[] ($stride * $h)

# Exclude central grille band horizontally (keep only headlight zones)
$cLo = [int]($w * 0.44)
$cHi = [int]($w * 0.56)

$kept = 0
for ($y = 0; $y -lt $h; $y++) {
  $row = $y * $stride
  for ($x = 0; $x -lt $w; $x++) {
    $i = $row + $x * 4
    $b = $buf[$i]; $g = $buf[$i + 1]; $r = $buf[$i + 2]

    # White / cool-white only: all channels high, not blue-dominant
    $isWhite = ($r -gt 135 -and $g -gt 150 -and $b -gt 150 -and ($b - $r) -lt 75)
    $inGrille = ($x -ge $cLo -and $x -le $cHi)

    if ($isWhite -and -not $inGrille) {
      $lum = [int](($r + $g + $b) / 3)
      $a = [int](($lum - 130) * 2.4)
      if ($a -gt 255) { $a = 255 }
      if ($a -lt 0)   { $a = 0 }
      # white pixel, soft alpha (BGRA order)
      $out[$i]     = 255
      $out[$i + 1] = 255
      $out[$i + 2] = 255
      $out[$i + 3] = $a
      if ($a -gt 0) { $kept++ }
    } else {
      $out[$i] = 0; $out[$i + 1] = 0; $out[$i + 2] = 0; $out[$i + 3] = 0
    }
  }
}

# --- Write output bitmap ---
$dst = New-Object System.Drawing.Bitmap $w, $h, $fmt
$wr = $dst.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, $fmt)
[System.Runtime.InteropServices.Marshal]::Copy($out, 0, $wr.Scan0, $out.Length)
$dst.UnlockBits($wr)
$dst.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$pct = [math]::Round(($kept / ($w * $h)) * 100, 2)
Write-Host "OK -> $outPath"
Write-Host "Kept white pixels: $kept ($pct% of image)"

$src.Dispose(); $dst.Dispose()
