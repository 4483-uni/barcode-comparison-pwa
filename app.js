document.getElementById('compare').addEventListener('click', function() {
    const barcode1 = document.getElementById('barcode1').value;
    const barcode2 = document.getElementById('barcode2').value;
    const resultElement = document.getElementById('result');

    if (barcode1 === barcode2) {
        resultElement.textContent = 'OK: データマトリクスが一致しました';
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = 'NG: データマトリクスが一致しません';
        resultElement.style.color = 'red';
    }
});
