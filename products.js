import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const url = 'https://vue3-course-api.hexschool.io';
const myToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,"$1",);
axios.defaults.headers.common['Authorization'] = myToken;
const myPath = 'ttmtest';
// 在全域設好變數，再到mounted使用new boostrap.Modal來建立Modal實體
let productModal = null;
let delProductModal = null;

createApp({
    data(){
        return{
            products:[],
            // 表示當前Modal是要新增還是編輯
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
        }
    },
    methods:{
        checkLogin(){
            axios.post(`${url}/v2/api/user/check`)
            .then((res) => {
                this.getProducts()
            })
            .catch((err) => {
                location.href = './index.html';
                alert(err.response.data.message);
            })
        },
        getProducts(){
            axios.get(`${url}/v2/api/${myPath}/admin/products`)
            .then((res) => {
                this.products = res.data.products
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        openModal(status, item){
            if (status === "new") {
                this.isNew = true;
                this.tempProduct= {
                    imagesUrl: [],
                }
                productModal.show();
            }else if(status === "edit"){ 
                this.isNew = false;
                this.tempProduct = { ...item };
                productModal.show();
            }else if(status === "del"){ 
                this.tempProduct = { ...item };
                delProductModal.show();
            }
        },
        updateProduct(){
            // 若isNew為true則發送post api，若為false則發送put api
            let updateStatus = "post";
            let updateUrl = `${url}/v2/api/${myPath}/admin/product`

            if (this.isNew === false) {
                updateStatus = "put";
                updateUrl = `${url}/v2/api/${myPath}/admin/product/${this.tempProduct.id}`
            }

            axios[updateStatus]( updateUrl, { data: this.tempProduct } )
            .then((res) => {
                alert(res.data.message);
                productModal.hide();
                this.getProducts();
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        deleteProduct(){
            axios.delete( `${url}/v2/api/${myPath}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct } )
            .then((res) => {
                alert(res.data.message);
                delProductModal.hide();
                this.getProducts();
            })
            .catch((err) => {
                alert(err.response.data.message);
            })
        },
        createImages(){
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('')
        }
    },
    mounted(){
        this.checkLogin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'), 
            {
                // keyboard: false禁止使用者透過Esc關閉視窗，backdrop: 'static'禁止使用者點擊Modal以外的地方來關閉視窗
                keyboard: false,
                backdrop: 'static'
            });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), 
            {
                keyboard: false,
                backdrop: 'static'
            })
    }
}).mount('#app')