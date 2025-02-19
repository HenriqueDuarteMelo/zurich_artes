var url_padrao = 'http://189.29.149.231:3000/api/'
//192.168.10.5

export default {
    data() {
        return {
            result_api: []
        }
    },

    async get(rota, parametros) {
        var url = url_padrao
        url += rota
        var str_params = ''
        for (var i = 0; i < parametros.length; i++) {
            str_params += `/${parametros[i]}`
        }
        url += str_params
        console.log(url)
        await fetch(url)
            .then((resp) => resp.json())
            .then((data) => this.result_api = data)
        return this.result_api
    },

    async post(rota, json) {
        var url = url_padrao
        url += rota
        const config = {
            method: "POST",
            body: JSON.stringify(json),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var request = new Request(url, config)
        await fetch(request)
            .then((resp) => resp.json())
            .then((data) => this.result_api = data)
        return this.result_api
    },
}