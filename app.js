// スキャン試行回数のカウンターを初期化
let scanCount = 0;
let scanning = false;

// バーコード比較機能
document.getElementById('compare').addEventListener('click', function() {
    const barcode1 = document.getElementById('barcode1').value;
    const barcode2 = document.getElementById('barcode2').value;
    const resultElement = document.getElementById('result');

    if (barcode1 === barcode2) {
        resultElement.textContent = 'OK: バーコードが一致しました';
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = 'NG: バーコードが一致しません';
        resultElement.style.color = 'red';
    }
});

// ZXingを使用してデータマトリクスを読み取る機能
document.getElementById('start-scan').addEventListener('click', function() {
    const hints = new Map();
    hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [ZXing.BarcodeFormat.DATA_MATRIX]);
    hints.set(ZXing.DecodeHintType.TRY_HARDER, true);

    const codeReader = new ZXing.BrowserMultiFormatReader(hints);
    const videoElement = document.getElementById('video');

    scanCount = 0;
    document.getElementById('scanCount').textContent = scanCount;
    document.getElementById('scanning-indicator').style.display = 'block';
    scanning = true;

    const scanInterval = setInterval(() => {
        if (!scanning) {
            clearInterval(scanInterval);
            return;
        }
        codeReader.decodeOnceFromVideoElement(videoElement).then(result => {
            console.log(result);
            document.getElementById('barcode1').value = result.text;
            scanning = false;
            codeReader.reset();
            document.getElementById('scanning-indicator').style.display = 'none';
        }).catch(err => {
            if (!(err instanceof ZXing.NotFoundException)) {
                console.error(err);
            }
        });

        // スキャン試行回数を更新
        scanCount++;
        document.getElementById('scanCount').textContent = scanCount;

    }, 500); // 500ミリ秒ごとにスキャン
});
