// app.js

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

                // ビデオが再生されたことを確認してからスキャンを開始
                videoElement.addEventListener('loadeddata', () => {
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
                                    // バーコードが見つからない場合、再スキャン
                                    requestAnimationFrame(scanBarcode);
                                }
                            })
                            .catch(err => {
                                console.error('バーコードの検出中にエラーが発生しました: ', err);
                                alert(`バーコード検出エラー: ${err.message}`);

                                // スキャン中の表示を停止
                                document.getElementById('scanning-indicator').style.display = 'none';

                                // カメラストリームを停止
                                stream.getTracks().forEach(track => track.stop());
                            });
                    };

                    // スキャンを開始
                    scanBarcode();
                    //requestAnimationFrame(scanBarcode);
                });
            })
            .catch(err => {
                console.error('カメラへのアクセス中にエラーが発生しました: ', err);
                alert(`カメラアクセスエラー: ${err.message}`);

                // スキャン中の表示を停止
                document.getElementById('scanning-indicator').style.display = 'none';
            });
    } else {
        alert('このブラウザはBarcode Detector APIをサポートしていません。最新のChromeまたはEdgeをご利用ください。');
    }
});
