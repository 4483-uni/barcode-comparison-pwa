// スキャン試行回数のカウンターを初期化
let scanCount = 0;

// スキャン関数
function startScan(videoElement, barcodeDetector) {
    const scan = () => {
        // カメラ映像のスキャン
        barcodeDetector.detect(videoElement)
            .then(barcodes => {
                if (barcodes.length > 0) {
                    console.log('バーコード検出:', barcodes[0].rawValue);
                    document.getElementById('barcode1').value = barcodes[0].rawValue;

                    // スキャン終了時にストリームを停止
                    const stream = videoElement.srcObject;
                    stream.getTracks().forEach(track => track.stop());

                    // スキャン終了後の処理
                    document.getElementById('scanning-indicator').style.display = 'none';
                } else {
                    // バーコードが検出されなかった場合、次のフレームで再試行
                    requestAnimationFrame(scan);
                }
            })
            .catch(err => {
                console.error('検出エラー:', err);
                // エラー発生時にも次のフレームで再試行
                requestAnimationFrame(scan);
            });

        // スキャン試行回数をカウント
        scanCount++;
        document.getElementById('scanCount').textContent = scanCount;
    };

    // 初回スキャンを実行
    requestAnimationFrame(scan);
}

// スキャン開始ボタンのクリックイベント
document.getElementById('start-scan').addEventListener('click', function() {
    const videoElement = document.getElementById('video');
    const scanningIndicator = document.getElementById('scanning-indicator');

    // BarcodeDetector APIのサポート確認
    if ('BarcodeDetector' in window) {
        const barcodeDetector = new BarcodeDetector({ formats: ['data_matrix'] });

        // カメラの映像を取得
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 60 }, video: { zoom: true }  } })
            .then(stream => {
                videoElement.srcObject = stream;
                videoElement.play();

                // スキャン中の表示を開始
                scanningIndicator.style.display = 'block';

                // スキャンを開始
                scanCount = 0;
                startScan(videoElement, barcodeDetector);
            })
            .catch(err => {
                console.error('カメラへのアクセスに失敗しました:', err);
                alert('カメラへのアクセスが拒否されました。');
            });
    } else {
        alert('このブラウザはBarcode Detector APIをサポートしていません。');
    }
});
