document.getElementById('compare').addEventListener('click', function() {
    const barcode1 = document.getElementById('barcode1').value;
    const barcode2 = document.getElementById('barcode2').value;
    const resultElement = document.getElementById('result');

    if (barcode1 === barcode2) {
        resultElement.textContent = 'OK: �o�[�R�[�h����v���܂���';
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = 'NG: �o�[�R�[�h����v���܂���';
        resultElement.style.color = 'red';
    }
});
