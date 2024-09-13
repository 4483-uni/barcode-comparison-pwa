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

// Quagga2を使用してデータマトリクスを読み取る機能
document.getElementById('start-scan').addEventListener('click', function() {
    // Quagga2の初期化とカメラ設定
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: document.querySelector('#video'),
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["datamatrix"]  // データマトリクスリーダーを使用
        },
        locate: true,
        numOfWorkers: 4
    }, function(err) {
        if (err) {
            console.error("Error initializing Quagga:", err);
            alert('Quaggaの初期化に失敗しました。');
            return;
        }
        Quagga.start();
    });

    // スキャン結果の処理
    Quagga.onDetected(function(result) {
        const code = result.codeResult.code;
        console.log("Scanned code: ", code);
        document.getElementById('barcode1').value = code;  // 結果を入力欄に反映
        Quagga.stop();  // スキャンを停止
    });
});
