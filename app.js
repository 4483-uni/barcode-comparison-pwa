// app.js

// サポートされているバーコード形式を表示する関数
function displaySupportedFormats() {
    if ('BarcodeDetector' in window) {
        BarcodeDetector.getSupportedFormats()
            .then(formats => {
                console.log('サポートされているバーコード形式:', formats);
                const supportedFormatsElement = document.getElementById('supported-formats');
                supportedFormatsElement.textContent = 'サポートされているバーコード形式: ' + formats.join(', ');
            })
            .catch(err => {
                console.error('サポートされているフォーマットの取得中にエラーが発生しました:', err);
            });
    } else {
        alert('このブラウザはBarcode Detector APIをサポートしていません。');
    }
}

// ページ読み込み時にサポートされているバーコード形式を確認して表示
document.addEventListener('DOMContentLoaded', function() {
    displaySupportedFormats();
});

// スキャン開始ボタンのクリックイベント
document.getElementById('start-scan').addEventListener('click', function() {
    // 対応ブラウザかチェック
    if ('BarcodeDetector' in window) {
        // 対応するバーコード形式を指定
        const barcodeDetector = new BarcodeDetector({ formats: ['data_matrix'] });
        const videoElement = document.getElementById('video');
        //const canvasElement = document.getElementById('canvas');
        //const context = canvasElement.getContext('2d');

        // スキャン中の表示を開始
        document.getElementById('scanning-indicator').style.display = 'block';

        // カメラの映像を取得
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } })
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
                    //scanBarcode();
                    requestAnimationFrame(scanBarcode);
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
