import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

const url = 'https://vue3-course-api.hexschool.io';


createApp({
    data(){
        return{
            user:{
                username:'',
                password:''
            }
        }
    },
    methods:{
        login(){
            // 向指定 URL 發送API請求，請求內容為this.user
            axios.post(`${url}/v2/admin/signin`, this.user)
            .then((res) => {
                // 解構賦值，從res.data直接提取token和expired
                const { token, expired } = res.data;
                // 將hexToken和expired寫入瀏覽器的cookie
                document.cookie = `hexToken=${token};expired=${new Date(expired)}`;
                location.href="./products.html";
            })
            .catch((err) =>{
                alert(err.response.data.message)
                this.user = {}
            })
        }
    }
}).mount('#app');