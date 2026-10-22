"""Gera o QR Code que leva à página de cuidados com a toalha.

Uso:  python scripts/gerar_qrcode.py [URL]
      (padrão: https://www.tuahome.com.br/cuidados.html)

Requer: pip install segno

Gera em assets/img/:
  qrcode-cuidados.svg  -> vetor, ideal para gráfica (tag / cartão da embalagem)
  qrcode-cuidados.png  -> imagem em alta resolução
"""
import sys
from pathlib import Path

import segno

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img"
URL_PADRAO = "https://www.tuahome.com.br/cuidados.html"
MARROM = "#4A3426"


def main() -> None:
    url = sys.argv[1] if len(sys.argv) > 1 else URL_PADRAO
    qr = segno.make(url, error="m")
    OUT.mkdir(parents=True, exist_ok=True)
    qr.save(OUT / "qrcode-cuidados.svg", dark=MARROM, light=None, border=2, scale=10)
    qr.save(OUT / "qrcode-cuidados.png", dark=MARROM, light=None, border=2, scale=24)
    print(f"QR Code gerado para: {url}")


if __name__ == "__main__":
    main()
