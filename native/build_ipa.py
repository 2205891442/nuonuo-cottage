"""在native工作目录执行；标准UTF-8 ZIP兼容Windows签名工具。"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
payload = Path('build/release/Payload')
assert (payload / 'App.app/App').is_file()
with ZipFile('build/release/Nuonuo-unsigned.ipa', 'w', ZIP_DEFLATED) as archive:
    for item in sorted(payload.rglob('*')):
        if item.is_file():
            archive.write(item, item.relative_to(payload.parent).as_posix())
