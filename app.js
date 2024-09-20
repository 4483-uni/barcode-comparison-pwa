// app.js
// 新しい検出器の生成
var barcodeDetector = new BarcodeDetector({
  formats: ["code_39", "codabar", "ean_13"],
});

// 互換性のチェック
if (barcodeDetector) {
  alert('Barcode Detector に対応しています。');
} else {
  alert('Barcode Detector はこのブラウザーでは対応していません。');
}

/*
// スキャン開始ボタンのクリックイベント
document.getElementById('start-scan').addEventListener('click', function() {
    // 対応ブラウザかチェック
    if ('BarcodeDetector' in window) {
        // 対応するバーコード形式を指定
        const barcodeDetector = new BarcodeDetector({ formats: ['data_matrix'] });
        const videoElement = document.getElementById('video');

        // スキャン中の表示を開始
        document.getElementById('scanning-indicator').style.display = 'block';

        // カメラの映像を取得
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                videoElement.srcObject = stream;
                videoElement.play();

                // スキャン関数の定義
                const scanBarcode = () => {
                    barcodeDetector.detect(videoElement)
                        .then(barcodes => {
                            if (barcodes.length > 0) {
                                // バーコードが検出された場合
                                document.getElementById('barcode1').value = barcodes[0].rawValue;

                                // スキャン中の表示を停止
                                document.getElementById('scanning-indicator').style.display = 'none';

                                // カメラストリームを停止
                                stream.getTracks().forEach(track => track.stop());
                            } else {
                                // 再度スキャンを試みる
                                requestAnimationFrame(scanBarcode);
                            }
                        })
                        .catch(err => {
                            console.error(err);
                            alert('バーコードの検出中にエラーが発生しました。');

                            // スキャン中の表示を停止
                            document.getElementById('scanning-indicator').style.display = 'none';

                            // カメラストリームを停止
                            stream.getTracks().forEach(track => track.stop());
                        });
                };

                // スキャンを開始
                scanBarcode();
            })
            .catch(err => {
                console.error(err);
                alert('カメラへのアクセスが拒否されました。');
                // スキャン中の表示を停止
                document.getElementById('scanning-indicator').style.display = 'none';
            });
    } else {
        alert('このブラウザはBarcode Detector APIをサポートしていません。最新のChromeまたはEdgeをご利用ください。');
    }
});
*/
