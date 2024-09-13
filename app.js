// バーコード比較機能（既存のコードはそのまま）
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

// Barcode Detector APIを使用してデータマトリクスを読み取る機能
document.getElementById('start-scan').addEventListener('click', function() {
    if (!('BarcodeDetector' in window)) {
        alert('このブラウザはBarcode Detector APIをサポートしていません。');
        return;
    }

    // データマトリクスを含むバーコード形式を指定
    const formats = ['data_matrix'];
    const barcodeDetector = new BarcodeDetector({ formats });

    // カメラの映像を取得
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            const video = document.getElementById('video');
            video.srcObject = stream;
            video.play();

            // フレームごとにバーコードを検出
            const detectBarcode = () => {
                barcodeDetector.detect(video)
                    .then(barcodes => {
                        if (barcodes.length > 0) {
                            // バーコードを検出したら処理
                            console.log(barcodes[0].rawValue);
                            document.getElementById('barcode1').value = barcodes[0].rawValue;
                            // ストリームを停止
                            stream.getTracks().forEach(track => track.stop());
                            video.pause();
                        } else {
                            // 次のフレームで再度検出
                            requestAnimationFrame(detectBarcode);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        alert('バーコードの検出中にエラーが発生しました。');
                    });
            };

            // 検出を開始
            requestAnimationFrame(detectBarcode);
        })
        .catch(err => {
            console.error(err);
            alert('カメラへのアクセスが許可されていないか、エラーが発生しました。');
        });
});
