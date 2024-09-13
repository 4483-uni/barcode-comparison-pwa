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
    const codeReader = new ZXing.BrowserBarcodeReader([ZXing.BarcodeFormat.DATA_MATRIX]);
    const videoElement = document.getElementById('video');

    // カメラの制約を設定
    const constraints = {
        video: {
            facingMode: 'environment', // 背面カメラを使用
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            focusMode: 'continuous' // フォーカスを自動調整
        }
    };

    codeReader.decodeOnceFromConstraints(constraints, 'video').then(result => {
        console.log(result);
        document.getElementById('barcode1').value = result.text;
        codeReader.reset();
    }).catch(err => {
        console.error(err);
        alert('データマトリクスコードを読み取れませんでした。もう一度お試しください。');
    });
});


