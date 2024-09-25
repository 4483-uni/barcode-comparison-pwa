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
                const supportedFormatsElement = document.getElementById('supported-formats');
                supportedFormatsElement.textContent = 'サポートされているバーコード形式の取得に失敗しました。';
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
    const videoElement = document.getElementById('video');
    const canvasElement = document.getElementById('canvas');
    const context = canvasElement.getContext('2d');
    
    // 対応ブラウザかチェック
    if ('BarcodeDetector' in window) {
        // 対応するバーコード形式を指定
        const barcodeDetector = new BarcodeDetector({ formats: ['data_matrix'] });
        const constraints = {
            video: {
                facingMode: 'environment',
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                frameRate: { ideal: 60 }
            }
        };
        
        // スキャン中の表示を開始
        document.getElementById('scanning-indicator').style.display = 'block';

        // カメラの映像を取得
        //navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 60 } } })
        navigator.mediaDevices.getUserMedia(constraints)
            .catch(err => {
                console.warn('指定した解像度がサポートされていないため、デフォルト解像度にフォールバックします。', err);
                return navigator.mediaDevices.getUserMedia({ video: true }); // デフォルトの設定で再試行
            })
            .then(stream => {
                videoElement.srcObject = stream;
                videoElement.play();

                // ビデオが再生されたことを確認してからスキャンを開始
                videoElement.addEventListener('loadeddata', () => {

                    let scanning = true;  // スキャンの状態を管理するフラグ
                    
                    // スキャン関数の定義
                    const scanBarcode = () => {
                        if (!scanning) return;  // スキャンが停止された場合は実行しない

                        // カメラ映像の一部（中央）をcanvasに描画
                        context.drawImage(videoElement, 150, 100, 200, 150, 0, 0, canvasElement.width, canvasElement.height); // 映像の一部を取得
                        
                        barcodeDetector.detect(canvasElement)
                            .then(barcodes => {
                                if (barcodes.length > 0) {
                                    // バーコードが検出された場合
                                    document.getElementById('result').textContent = 'バーコードが検出されました: ' + barcodes[0].rawValue;
                                    document.getElementById('result').style.color = 'green';  // 成功時は緑色
                                    
                                    document.getElementById('barcode1').value = barcodes[0].rawValue;
                                    
                                    // スキャン中の表示を停止
                                    document.getElementById('scanning-indicator').style.display = 'none';

                                    scanning = false;  // スキャンを停止
                                    // カメラストリームを停止
                                    stream.getTracks().forEach(track => track.stop());
                                } else {
                                    // バーコードが見つからない場合、再スキャン
                                    document.getElementById('result').textContent = 'バーコードが見つかりませんでした。';
                                    document.getElementById('result').style.color = 'red';  // 失敗時は赤色
                                    requestAnimationFrame(scanBarcode);
                                }
                            })
                            .catch(err => {
                                console.error('バーコードの検出中にエラーが発生しました: ', err);
                                alert(`バーコード検出エラー: ${err.message}`);

                                // スキャン中の表示を停止
                                document.getElementById('scanning-indicator').style.display = 'none';

                                scanning = false;  // エラー発生時にスキャンを停止
                                
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
