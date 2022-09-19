/**
 * site: https://rn.olx.com.br/rio-grande-do-norte/natal?q=iphone
 * nome
 * valor
 * data de divulgação
 * código
 * link
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const siteAlvo = 'https://rn.olx.com.br/rio-grande-do-norte/natal?q=iphone';

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
    return dados;
    // console.log(dados);
};

const coletaDdos = async (pg) => {
    try {
        const resultado = await axios.get(pg);
        const htmlDados = resultado.data;
        const $ = await cheerio.load(htmlDados);

        let nomeProduto = $('#content > div.sc-18p038x-2.cMWwWm > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.gyKyRK > div.h3us20-6.UxTCE > div > div > h1').text();
        let valor = $('#content > div.sc-18p038x-2.cMWwWm > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.cpscHx > div.h3us20-6.jUPCvE > div > div > div.sc-hmzhuo.dtdGqP.sc-jTzLTM.iwtnNi > div.sc-hmzhuo.sc-12l420o-0.kUWFYY.sc-jTzLTM.iwtnNi > h2.sc-ifAKCX.eQLrcK').text();
        let publicacao = $('#content > div.sc-18p038x-2.cMWwWm > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.gyKyRK > div.h3us20-6.hzUJDA > div > div > div > span.sc-1oq8jzc-0.jvuXUB.sc-ifAKCX.fizSrB').text();
        let codigo = $('#content > div.sc-18p038x-2.cMWwWm > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.gyKyRK > div.h3us20-6.hzUJDA > div > div > div > span.sc-16iz3i7-0.qJvUT.sc-ifAKCX.fizSrB').text();

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
    fs.writeFileSync('./index.html', result, {flag: 'a+'}, function(err) {
        if (err) {
            console.log('Deu pau na geração do HTML: ', err);
        }
    })
};

const apresentaDados = async () => {
    const todosLinks = await listaLinks();
    todosLinks.map((linksFilhos) => {
        coletaDdos(linksFilhos);
    });
};

const main = async () => {
    await apresentaDados();
};

main();
