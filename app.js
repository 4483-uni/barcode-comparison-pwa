// スキャン試行回数のカウンターを初期化
let scanCount = 0;

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
    hints.set(ZXing.DecodeHintType.TRY_HARDER, true); // 認識精度を上げる

    //************************
    // スキャン間隔を設定（ミリ秒単位）
    const options = {
        delayBetweenScanAttempts: 500 // 500ミリ秒ごとにスキャン
    };
    //************************
    
    //const codeReader = new ZXing.BrowserMultiFormatReader(hints);
    const codeReader = new ZXing.BrowserMultiFormatReader(hints, options);
    const videoElement = document.getElementById('video');

    // スキャン試行回数をリセット
    scanCount = 0;
    document.getElementById('scanCount').textContent = scanCount;

    // 連続的なスキャンを開始
    codeReader.decodeFromVideoDevice(undefined, videoElement, (result, err) => {
        // スキャン試行回数を更新
        scanCount++;
        document.getElementById('scanCount').textContent = scanCount;

        if (result) {
            console.log(result);
            document.getElementById('barcode1').value = result.text; // 結果を入力欄に反映
            codeReader.reset(); // スキャンを停止
        }

        if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err);
        }
    });
});
