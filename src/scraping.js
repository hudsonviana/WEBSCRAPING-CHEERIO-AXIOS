const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// const siteAlvo = 'https://rn.olx.com.br/rio-grande-do-norte/natal?q=iphone';
const siteAlvo = 'https://rn.olx.com.br/rio-grande-do-norte/natal?q=onix%20plus';

const dados = [];

const dadosBrutos = async () => {
    try {
        const res = await axios.get(siteAlvo);
        return res.data;
        // console.log(res.data);
    } catch (error) {
        console.log('Deu pau ao extrair os dados brutos:', error);
    }
};

const listaLinks = async () => {
    const html = await dadosBrutos();
    const $ = await cheerio.load(html);
    $('.sc-12rk7z2-1.huFwya.sc-giadOv.dXANPZ').each(function(i, link) {
        dados[i] = $(link).attr('href');
    });
    console.log('Total:', dados.length);
    return dados;
};

const coletaDdos = async (pg) => {
    try {
        const resultado = await axios.get(pg);
        const htmlDados = resultado.data;
        const $ = await cheerio.load(htmlDados);

        let nomeProduto = $('#content > div.ad__sc-18p038x-2.djeeke > div > div.sc-bwzfXH.ad__h3us20-0.ikHgMx > div.ad__duvuxf-0.ad__h3us20-0.eCUDNu > div.ad__h3us20-6.iFvUie > div > div > div > div > h1').text(); 
        let valor = 'R$ ' + $('.sc-ifAKCX.eQLrcK').text();
        let publicacao = $('#content > div.ad__sc-18p038x-2.djeeke > div > div.sc-bwzfXH.ad__h3us20-0.ikHgMx > div.ad__duvuxf-0.ad__h3us20-0.eCUDNu > div.ad__h3us20-6.hQCBiM > div > div > div > span.ad__sc-1oq8jzc-0.hSZkck.sc-ifAKCX.fizSrB').text();
        let codigo = $('.ad__sc-16iz3i7-0.bTSFxO.sc-ifAKCX.fizSrB').text();

        const resFinal = `
            <h1>Produto: ${nomeProduto}</h1>
            <h3>Valor: ${valor}</h3>
            <h3>Publicação: ${publicacao}</h3>
            <h3>Código: ${codigo}</h3>
            <h3>Link: <a href="${pg}">Produto</a></h3>
            <br />
        `;
        gravaHtml(resFinal);
        // console.log(resFinal);

    } catch (error) {
        console.log('Deu problema na extração dos dados:', error);
    }
};

const gravaHtml = async (result) => {
    fs.writeFileSync('./src/index.html', result, {flag: 'a+'}, function(err) {
        if (err) {
            console.log('Deu pau na geração do HTML: ', err);
        }
    })
};

const apresentaDados = async () => {
    const todosLinks = await listaLinks();
    todosLinks.map((linksFilhos) => {
        console.log(todosLinks.indexOf(linksFilhos) + 1);
        coletaDdos(linksFilhos);
    });
};

const main = async () => {
    await apresentaDados();
};

main();
