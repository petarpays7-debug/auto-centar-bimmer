param()
$dest = Join-Path $PSScriptRoot "..\autocentar-bimmer-assets"
$ua  = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"
$ref = "https://www.njuskalo.hr/"

function Get-Image($url, $fname) {
    $path = Join-Path $dest $fname
    $wc = New-Object System.Net.WebClient
    $wc.Headers.Add("User-Agent", $ua)
    $wc.Headers.Add("Referer", $ref)
    try {
        $wc.DownloadFile($url, $path)
        $b = [IO.File]::ReadAllBytes($path)
        if ($b.Length -gt 3 -and $b[0] -eq 0xFF -and $b[1] -eq 0xD8) {
            $kb = [math]::Round($b.Length/1024)
            Write-Host "OK   ${kb}KB   $fname"
            return $true
        } else {
            Write-Host "WARN not-jpeg $fname"
            Remove-Item $path -Force -ErrorAction SilentlyContinue
            return $false
        }
    } catch {
        Write-Host "FAIL $fname : $_"
        return $false
    } finally {
        $wc.Dispose()
    }
}

$ok = 0
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-serija-3-318d-automatik-slika-273878990.jpg" "bmw-318d-g20-2020.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-320d-m-paket-original-prformance-kocnine-slika-276728188.jpg" "bmw-320d-m-paket-2013.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-serija-1-118d-automatik-m-paket-orginal-slika-226226647.jpg" "bmw-118d-automatik-m-paket-2015.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-525d-6cyl-automatik-slika-277989609.jpg" "bmw-525d-2011.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-320d-m-paket-original-slika-278690920.jpg" "bmw-320d-m-paket-2011.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-serija-1-118d-slika-277128175.jpg" "bmw-118d-2017.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-serija-3-318d-slika-278746984.jpg" "bmw-318d-2015.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-serija-1-118d-slika-274048665.jpg" "bmw-118d-2016.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-serija-3-touring-318d-slika-265613060.jpg" "bmw-318d-touring-2015.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-serija-1-120d-slika-264868639.jpg" "bmw-120d-2013-276k.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-serija-3-318d-edition-slika-279219821.jpg" "bmw-318d-edition-2012.jpg") { $ok++ }
if (Get-Image "https://www.njuskalo.hr/image-w920x690/auti/bmw-serija-1-118d-izuzetno-ocuvan-slika-279289060.jpg" "bmw-118d-2007.jpg") { $ok++ }

Write-Host ""
Write-Host "Done: $ok / 12 downloaded OK"
