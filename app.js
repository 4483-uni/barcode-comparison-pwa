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

// カメラからデータマトリクスを読み取る機能
document.getElementById('start-scan').addEventListener('click', function() {
    // QuaggaJSの初期化とカメラ設定
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: document.querySelector('#scanner'),
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"  // 背面カメラを使用
                }
        },
        decoder: {
            readers: ["datamatrix_reader"]  // データマトリクスリーダーを使用
        },
        locate: true,  // バーコードの位置を自動検出
        debug: true  // デバッグモードを有効にする
    }, function(err) {
        if (err) {
            console.error("Error initializing Quagga:", err);
            return;
        }
        Quagga.start();  // スキャンの開始
    });
    
    // スキャン結果の処理
    Quagga.onDetected(function(result) {
        const code = result.codeResult.code;  // 読み取ったコードを取得
        console.log("Scanned code: ", code);  // コンソールに結果を表示
        document.getElementById('barcode1').value = code;  // 結果を入力欄に反映
        Quagga.stop();  // 一度読み取ったらスキャンを停止
    });
});
