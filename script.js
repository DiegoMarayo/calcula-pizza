document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("prefermento").addEventListener("change", atualizarCampos);
});

function atualizarCampos() {
    const tipo = document.getElementById("prefermento").value;
    const fermentoInput = document.getElementById("fermento");

    document.getElementById("bigaCampos").style.display = tipo === "biga" ? "block" : "none";
    document.getElementById("poolishCampos").style.display = tipo === "poolish" ? "block" : "none";

    if (tipo === "biga" || tipo === "poolish") {
        fermentoInput.value = ""; // Limpa o campo
        fermentoInput.disabled = true; // Desativa o input
    } else {
        fermentoInput.disabled = false; // Reativa o input se for método direto
    }
}

function calcularMassa() {
    const quantidade = parseFloat(document.getElementById("quantidade").value) || 0;
    const peso = parseFloat(document.getElementById("peso").value) || 0;
    const hidratacao = parseFloat(document.getElementById("hidratacao").value) / 100 || 0;
    const sal = parseFloat(document.getElementById("sal").value) / 100 || 0;
    const mel = parseFloat(document.getElementById("mel").value) / 100 || 0;
    const tipoPrefermento = document.getElementById("prefermento").value;

    let fermento = 0;
    if (tipoPrefermento === "") {
        fermento = parseFloat(document.getElementById("fermento").value) / 100 || 0;
    }

    if (quantidade <= 0 || peso <= 0) {
        document.getElementById("resultado").innerHTML = "❌ Preencha os campos corretamente!";
        return;
    }

    let msg = "";

    if (tipoPrefermento === "") { 
        msg = `<strong>Método Direto:</strong><br>
               Farinha: ${calcularFarinhaTotal(quantidade, peso, hidratacao, sal, fermento, mel).toFixed(2)}g<br>
               Água: ${(calcularFarinhaTotal(quantidade, peso, hidratacao, sal, fermento, mel) * hidratacao).toFixed(2)}g<br>
               Sal: ${(calcularFarinhaTotal(quantidade, peso, hidratacao, sal, fermento, mel) * sal).toFixed(2)}g<br>
               Fermento: ${(calcularFarinhaTotal(quantidade, peso, hidratacao, sal, fermento, mel) * fermento).toFixed(2)}g<br>
               Mel: ${(calcularFarinhaTotal(quantidade, peso, hidratacao, sal, fermento, mel) * mel).toFixed(2)}g<br>`;
    }

    if (tipoPrefermento === "biga") {
        const proporcaoBiga = parseFloat(document.getElementById("bigaQuantidade").value) / 100;
        const bigaHidratacao = parseFloat(document.getElementById("bigaHidratacao").value) / 100;
        const bigaFermento = parseFloat(document.getElementById("bigaFermento").value) / 100;

        if (isNaN(proporcaoBiga) || isNaN(bigaHidratacao) || isNaN(bigaFermento)) {
            document.getElementById("resultado").innerHTML = "❌ Preencha todos os campos da BIGA!";
            return;
        }

        msg = gerarMensagemBiga(proporcaoBiga, bigaHidratacao, bigaFermento, quantidade, peso, hidratacao, sal, mel);
    }

    if (tipoPrefermento === "poolish") {
        const proporcaoPoolish = parseFloat(document.getElementById("poolishQuantidade").value) / 100;
        const fermentoPoolish = parseFloat(document.getElementById("poolishFermento").value) / 100;

        if (isNaN(proporcaoPoolish) || isNaN(fermentoPoolish)) {
            document.getElementById("resultado").innerHTML = "❌ Preencha todos os campos do POOLISH!";
            return;
        }

        msg = gerarMensagemPoolish(proporcaoPoolish, fermentoPoolish, quantidade, peso, hidratacao, sal, mel);
    }

    document.getElementById("resultado").innerHTML = msg;
}

function calcularFarinhaTotal(quantidade, peso, hidratacao, sal, fermento, mel) {
    return (quantidade * peso) / (1 + hidratacao + sal + fermento + mel);
}

function gerarMensagemBiga(proporcaoBiga, bigaHidratacao, bigaFermento, quantidade, peso, hidratacao, sal, mel) {
    const farinhaTotal = calcularFarinhaTotal(quantidade, peso, hidratacao, sal, 0, mel);
    const farinhaBiga = farinhaTotal * proporcaoBiga;
    const aguaBiga = farinhaBiga * bigaHidratacao;
    const fermentoBiga = farinhaTotal * bigaFermento;

    const farinhaFinal = farinhaTotal - farinhaBiga;
    const aguaFinal = (farinhaTotal * hidratacao) - aguaBiga;

    return `<strong>Biga:</strong><br>
            Farinha: ${farinhaBiga.toFixed(2)}g<br>
            Água: ${aguaBiga.toFixed(2)}g<br>
            Fermento: ${fermentoBiga.toFixed(2)}g<br>
            <br><strong>Massa Final:</strong><br>
            Farinha: ${farinhaFinal.toFixed(2)}g<br>
            Água: ${aguaFinal.toFixed(2)}g<br>
            Sal: ${(farinhaTotal * sal).toFixed(2)}g<br>
            Mel: ${(farinhaTotal * mel).toFixed(2)}g<br>`;
}

function gerarMensagemPoolish(proporcaoPoolish, fermentoPoolish, quantidade, peso, hidratacao, sal, mel) {
    const farinhaTotal = calcularFarinhaTotal(quantidade, peso, hidratacao, sal, 0, mel);
    const farinhaPoolish = farinhaTotal * proporcaoPoolish;
    const aguaPoolish = farinhaPoolish;
    const fermentoPoolishTotal = farinhaTotal * fermentoPoolish;

    const farinhaFinal = farinhaTotal - farinhaPoolish;
    const aguaFinal = (farinhaTotal * hidratacao) - aguaPoolish;

    return `<strong>Poolish:</strong><br>
            Farinha: ${farinhaPoolish.toFixed(2)}g<br>
            Água: ${aguaPoolish.toFixed(2)}g<br>
            Fermento: ${fermentoPoolishTotal.toFixed(2)}g<br>
            <br><strong>Massa Final:</strong><br>
            Farinha: ${farinhaFinal.toFixed(2)}g<br>
            Água: ${aguaFinal.toFixed(2)}g<br>
            Sal: ${(farinhaTotal * sal).toFixed(2)}g<br>
            Mel: ${(farinhaTotal * mel).toFixed(2)}g<br>`;
}
