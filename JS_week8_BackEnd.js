/**  ✅ ⏳
 * 【訂單相關(管理者)】admin
 * api：取得訂單列表(get) ✅ apiGetOrderList()，返還response.data.orders
 *     執行 ## 函式：渲染前端訂單介面 ✅ renderOrderList(apiGetOrderList);
 *     執行 ## 函式：生成c3.全產品類別營收比重資料 ✅
 *     執行 ## 函式：生成c3.全產品類別營收比重圓餅圖 ✅
 *     執行 ## 函式：根據當前的統計方式決定要生成何種圓餅圖 ✅
 * api：修改訂單狀態(put) ✅ apiPutPaidStatus(orderId, paidToggle)，返還response.data.orders
 *      執行 ## 函式：渲染前端訂單介面✅
 * api：刪除全部訂單(delete) ✅ apiDeleteAllOrder()，返還response.data.orders(應為空)
 *      執行 ## 函式：渲染前端訂單介面 ✅
 *      執行 ## 函式：生成c3.全產品類別營收比重資料 ✅
 *      執行 ## 函式：生成c3.全產品類別營收比重圓餅圖 ✅
 *      執行 ## 函式：根據當前的統計方式決定要生成何種圓餅圖 ✅
 *      執行 ## 函式：訂單表格為空時，將清除全部訂單按鈕disable✅
 * api：刪除特定訂單(delete)  ✅ apiDeleteCertainOrder(orderID)，返還response.data.orders
 *      執行 ## 函式：渲染前端訂單介面 ✅
 *      執行 ## 函式：生成c3.全產品類別營收比重資料 ✅
 *      執行 ## 函式：生成c3.全產品類別營收比重圓餅圖 ✅
 *      執行 ## 函式：根據當前的統計方式決定要生成何種圓餅圖 ✅
 *      執行 ## 函式：訂單表格為空時，將清除全部訂單按鈕disable✅
 *     
 * 函式：渲染前端訂單介面 (input：response.data.orders) ✅ renderOrderList(apiGetOrderList);
 * 函式：時間戳記轉年月日 ✅ timestampFormat(timestamp)
 * 函式：確認視窗 ✅showConfirmWindows(title, text, confirmText = "確認", icon = "info")
 * 函式：訂單表格為空時，將清除全部訂單按鈕disable ✅toggleDeleteAllOrder(latestCartData)
 * 
 * 監聽：切換統計方式 ✅  changeChartType()
 *      執行 ## 函式：根據當前的統計方式決定要生成何種圓餅圖 ✅   
 * 監聽：清除全部訂單 ✅ clickDeleteAllOrder()
 *      執行 ## api：刪除全部訂單(delete)
 * 
 * // 訂單列表共同監聽器 clickOrderTable()
 * 監聽：刪除特定訂單  ✅
 *      執行 ##  api：刪除特定訂單✅
 * 監聽：修改訂單狀態(輸入訂單id + 已付款/未付款) ✅ 
 *      執行 ## api：修改訂單狀態✅
 * 
 * 【統計圖表】
 * 函式：生成c3.全產品類別營收比重資料(productCategoryStatistic) ✅ updateProductCategoryStatistic(apiOrderData)
 * 函式：生成c3.全產品類別營收比重圓餅圖 ✅ createProductCategoryStatistic(productCategoryStatistic); 
 * 函式：生成c3.圓餅圖   (productItemStatistic) ✅createStatisticChart(statisticData)
 * 函式：根據當前的統計方式決定要生成何種圓餅圖 ⏳currentChartType()
 *      執行 ## 函式：生成c3.圓餅圖
 * 
 */



/** 主邏輯運行順序(初始化函式)
 * 執行 api：取得訂單列表(get)
*/


/**全域變數 */
// api 相關

let apiOrderData ; // ⭐ 最新的訂單物件，型態為 response.data.orders
const apiDomain = 'https://livejs-api.hexschool.io/api/livejs/v1/'
const apiPath = 'brice'
const apiKey = '2AEq7w7yVIO2HODGGSysMtuj2vS2';
const config = { // 放在post參數之後
    headers: {
            'authorization': apiKey, // 如果 API Key 格式需要 Bearer Token，則值會是：`Bearer ${apiKey}`
        }
    }
// 錯誤訊息吐司參數
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

// DOM相關

let orderPageTable = document.querySelector('.orderPage-table'); // 訂單表格，無須渲染即存在
const discardAllBtn = document.querySelector('.discardAllBtn'); //刪除全部訂單按鈕，無須渲染即存在
const chartWrapTitle = document.querySelector('.chart-wrap-title '); // 切換統計方式，無須渲染即存在
const sectionTitle = document.querySelector('.section-title '); // 統計圖表標題，無須渲染即存在

// 圖表相關
let productCategoryStatistic ; // 全產品類別營收比重資料
let productItemStatistic ; // 全產品類別營收比重資料
let chartGraphic; // 把圖表擺在全域變數，可控制載入 or 純陣列更新

/**========{全域變數}結束========== */

// api：取得訂單列表(get) 
async function apiGetOrderList(){
    const apiUrl = `${apiDomain}admin/${apiPath}/orders`;

    try{
        const response = await axios.get(apiUrl, config);
        apiOrderData = response.data.orders;      
        await updateProductCategoryStatistic(apiOrderData); //函式：生成c3.全產品類別營收比重資料(productCategoryStatistic)
        await updateProductItemStatistic(apiOrderData); // 函式：生成c3.全品項營收比重資料 (productItemStatistic)
        renderOrderList(apiOrderData); //     執行 ## 函式：渲染前端訂單介面
        currentChartType(); // 執行 ## 函式：根據當前的統計方式決定要生成何種圓餅圖
        return apiOrderData ;
    } catch (error) {

        let errorMessage = '發生未預期的錯誤';

        // 檢查是否有伺服器回傳的錯誤響應
        if (error.response) {
        // 伺服器有回傳的話，嘗試取出 error.response.data.message
        errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
        } else if (error.request) {
        // 請求已發出但沒有收到回應 (例如：網路中斷)
        errorMessage = '網路錯誤或伺服器無回應';
        } else {
        // 發生了在設定請求時觸發的錯誤
        errorMessage = error.message;
        }

        Toast.fire({
            icon: "error",
            title: '取得訂單列表失敗',
            text: errorMessage
        });
        throw error;
    }

}; // end of apiGetOrderList()

// 函式：時間戳記轉年月日
function timestampFormat(timestamp){
    const date = new Date(timestamp * 1000);
    const YYYY = date.getFullYear();
    const MM = date.getMonth() + 1;
    const DD = date.getDate();

    return `${YYYY}/${MM}/${DD}`;
}; // end of timestampFormat(timestamp)

// 函式：確認視窗 
async function showConfirmWindows(title, text, confirmText = "確認", icon = "info"){
    // 因為Swal.fire()是非同步，因此必須使用async

    const confirmWindow = await Swal.fire({
        title: title, // 確認視窗標題
        text: text, // 確認視窗文字
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: "brown",
        cancelButtonColor: "gray",
        confirmButtonText: confirmText,
        cancelButtonText: "取消",

        // 自定義的屬性
        customClass: {
            // 為確認按鈕附加一個自訂的 CSS 類別
            confirmButton: 'custom-confirm-button'
        }
    });
    return confirmWindow.isConfirmed;


}


// 函式：渲染前端訂單介面 (input：response.data.orders) 
function renderOrderList(apiOrderData){
    orderPageTable.innerHTML = ''
    let orderList = `
        <thead class="table-secondary">
            <tr>
                <th>訂單編號</th>
                <th>聯絡人</th>
                <th>聯絡地址</th>
                <th>電子郵件</th>
                <th>訂單品項</th>
                <th>訂單日期</th>
                <th>訂單狀態</th>
                <th>操作</th>
            </tr>
        </thead>
    `
    const orderListContent = apiOrderData.map(item => {
        const {
            id: orderId, // 訂單編號
            user: {
                name, // 	聯絡人上排
                tel, // 	聯絡人下排
                email, // 	電子郵件
                address, // 聯絡地址
                payment,
            },
            products: productArray,
            paid, // 訂單狀態
            quantity: orderQuantity,
            total,
            createdAt, // 訂單日期 (待轉換格式)
            updatedAt
        } = item;

        const singeProductComponent = productArray.map(product => {
            const {
                title,
                description,
                category,
                origin_price,
                price,
                images,
                id: productId,
                quantity: productQuantity
            } = product;

            return `<p id = ${productId}> 【${title}】 × ${productQuantity}件</p>`
        })

        // 時間戳記轉日期
        const createdDateFormat = timestampFormat(createdAt);

        // 付款布林值判斷 (條件式 ? True結果 : False結果)
        const paidStatusText = paid ? '已付款' : '未處理';

        return `<tr>
                    <td>${orderId}</td>
                    <td>
                        <p> ${name} </p>
                        <p> ${tel} </p>
                    </td>
                    <td> ${address}</td>
                    <td> ${email} </td>
                    <td class = 'productWrapper'>
                        ${singeProductComponent.join('')}
                    </td>
                    <td>${createdDateFormat}</td>
                    <td >
                        <a href="#" class="orderStatus" data-id = ${orderId} data-paid = ${paid} > ${paidStatusText} </a>
                    </td>
                    <td>
                        <input type="button" class="delSingleOrder-Btn" data-id = ${orderId} value="刪除">
                    </td>
                </tr>
                `
        
    }); // end of map
    
    orderList += orderListContent.join('');
    orderPageTable.insertAdjacentHTML('beforeend', orderList );
    


}; //end of renderOrderList(apiGetOrderList)

// api：刪除特定訂單(delete)，返還response.data.orders
async function apiDeleteCertainOrder(orderId){
    const apiUrl = `${apiDomain}admin/${apiPath}/orders/${orderId}`;

    try {
        const response = await axios.delete(apiUrl, config);
        Toast.fire({
          icon: "success",
          title: '已成功刪除下列訂單',
          text: orderId
        });

        apiOrderData = response.data.orders;
        await updateProductCategoryStatistic(apiOrderData); //函式：生成c3.全產品類別營收比重資料(productCategoryStatistic)
        await updateProductItemStatistic(apiOrderData); // 函式：生成c3.全品項營收比重資料 (productItemStatistic)
        currentChartType(); // 執行 ## 函式：根據當前的統計方式決定要生成何種圓餅圖
        renderOrderList(apiOrderData); //     執行 ## 函式：渲染前端訂單介面
        toggleDeleteAllOrder(apiOrderData); // 執行  ## 函式：訂單表格為空時，將清除全部訂單按鈕disable 
        return apiOrderData;

    } catch (error) {

        let errorMessage = '發生未預期的錯誤';

        // 檢查是否有伺服器回傳的錯誤響應
        if (error.response) {
        // 伺服器有回傳的話，嘗試取出 error.response.data.message
        errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
        } else if (error.request) {
        // 請求已發出但沒有收到回應 (例如：網路中斷)
        errorMessage = '網路錯誤或伺服器無回應';
        } else {
        // 發生了在設定請求時觸發的錯誤
        errorMessage = error.message;
        }

        Toast.fire({
        icon: "error",
        title: '刪除特定訂單失敗',
        text: errorMessage
        });
        throw error;
    }

}; // end of apiDeleteCertainOrder(orderID)

// api：刪除全部訂單
async function apiDeleteAllOrder(){
    const apiUrl = `${apiDomain}admin/${apiPath}/orders`
    try {
        const response = await axios.delete(apiUrl, config);
        Toast.fire({
        icon: "success",
        title: '已成功清除所有訂單',
        });

        apiOrderData = response.data.orders;
        renderOrderList(apiOrderData); //     執行 ## 函式：渲染前端訂單介面
        await updateProductCategoryStatistic(apiOrderData); //函式：生成c3.全產品類別營收比重資料(productCategoryStatistic)
        await updateProductItemStatistic(apiOrderData); // 函式：生成c3.全品項營收比重資料 (productItemStatistic)
        currentChartType(); // 執行 ## 函式：根據當前的統計方式決定要生成何種圓餅圖
        toggleDeleteAllOrder(apiOrderData); // 執行  ## 函式：訂單表格為空時，將清除全部訂單按鈕disable 
        return apiOrderData;

    } catch (error) {

        let errorMessage = '發生未預期的錯誤';

        // 檢查是否有伺服器回傳的錯誤響應
        if (error.response) {
        // 伺服器有回傳的話，嘗試取出 error.response.data.message
        errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
        } else if (error.request) {
        // 請求已發出但沒有收到回應 (例如：網路中斷)
        errorMessage = '網路錯誤或伺服器無回應';
        } else {
        // 發生了在設定請求時觸發的錯誤
        errorMessage = error.message;
        }

        Toast.fire({
        icon: "error",
        title: '刪除特定訂單失敗',
        text: errorMessage
        });
        throw error;
    }

}; // end of apiDeleteAllOrder()


// 函式：訂單表格為空時，將清除全部訂單按鈕disable  
function toggleDeleteAllOrder(latestCartData){
    if (!discardAllBtn) return; // 安全檢查，確保元素存在

    if (latestCartData && latestCartData.length === 0){
        discardAllBtn.classList.add('disabled-element'); // 利用 css pointer-events: none來控制
    } else {
        discardAllBtn.classList.remove('disabled-element');
    }
};

//  監聽：清除全部訂單 ⏳ 
function clickDeleteAllOrder(){
    
    discardAllBtn.addEventListener('click', async event => {
        event.preventDefault();
        const isConfirmed = await showConfirmWindows(
            '請確認是否刪除所有訂單',
            '請務必再三確認，一旦刪除以後就救不回來了喔🥺',
            '我真的確定，砍吧',
            'warning'
        )

        if (isConfirmed){
            await apiDeleteAllOrder();
            return;
        }
    });

}; // end of clickDeleteAllOrder()


// api：修改訂單狀態(put) ，返還response.data.orders
async function apiPutPaidStatus(orderId, paidToggle){

    const apiUrl = `${apiDomain}admin/${apiPath}/orders`
    const apiPutData = {
                "data": {
                "id": orderId,
                "paid": paidToggle
            }
        }

    try {
        const response = await axios.put(apiUrl, apiPutData, config);
        apiOrderData = response.data.orders;
        renderOrderList(apiOrderData); //     執行 ## 函式：渲染前端訂單介面
        return apiOrderData;

    } catch (error) {
        let errorMessage = '發生未預期的錯誤';

        // 檢查是否有伺服器回傳的錯誤響應
        if (error.response) {
        // 伺服器有回傳的話，嘗試取出 error.response.data.message
        errorMessage = error.response.data.message || `API 錯誤 (狀態碼: ${error.response.status})`;
        } else if (error.request) {
        // 請求已發出但沒有收到回應 (例如：網路中斷)
        errorMessage = '網路錯誤或伺服器無回應';
        } else {
        // 發生了在設定請求時觸發的錯誤
        errorMessage = error.message;
        }

        Toast.fire({
        icon: "error",
        title: '修改訂單狀態失敗',
        text: errorMessage
        });
        throw error;
    }


}; // end of apiPutPaidStatus(orderId, paidToggle)

// 訂單列表共同監聽器
function clickOrderTable() {
    orderPageTable.addEventListener('click', async event => {
        event.preventDefault();
        const clickElement = event.target;

        // 監聽：刪除特定訂單
        if (clickElement.classList.contains('delSingleOrder-Btn')){
            const orderId  = clickElement.dataset.id; // 訂單編號
            const isConfirmed = await showConfirmWindows(
                '請確認是否刪除下列訂單',
                `將刪除【${orderId}】，一旦刪除以後就救不回來了喔!`,
                '我真的確定，刪吧',
                'warning'
            );
            if (isConfirmed){
                apiDeleteCertainOrder(orderId); // api：刪除特定訂單
            return;
            };
            
        };

        // 監聽：修改訂單狀態(輸入訂單id + 已付款/未付款)
        if (clickElement.classList.contains('orderStatus')){
            const orderId  = clickElement.dataset.id; // 訂單編號
            const paidStatusString = clickElement.dataset.paid; // 當前付款狀態(注意從dataset取出的一律會轉為字串!!)
            const paidStatusBoolean = (paidStatusString === 'true'); // 會將"true"轉為true； 其餘轉為 false
            
            // 切換付款狀態
            let paidToggle;

            if (!paidStatusBoolean) {
                paidToggle = true;
            } else {
                paidToggle = false;
            };

            const paidToggleString = paidToggle ? "已付款" : "未處理";

            // ===跳出確認視窗後才
            // 跳出確認視窗
            const isConfirmed = await showConfirmWindows(
                '請確認付款狀態',
                `是否要將訂單 ${orderId} 的付款狀態切換為【${paidToggleString }】? `,
                '確認切換' // 點此才會讓isConfirmed成立
            );

            // 使用者確認後才執行api，退出則啥也沒發生
            if (isConfirmed){
                await apiPutPaidStatus(orderId, paidToggle);
                return;
            }

        }

    });
};



//  函式：生成c3.全產品類別營收比重資料(productCategoryStatistic) ⏳
// 目標：圓餅圖，做全產品類別營收比重，類別含三項，共有：床架、收納、窗簾
function updateProductCategoryStatistic(apiOrderData){
    /**
     * 產品類別 = orders.products.category
     * 單筆產品售價 = orders.products.price * orders.products.quantity
     * (區域)物件a：{產品類別1: 合計售價1, 產品類別2: 合計售價2 ...}
     * (全域)陣列b：[[產品類別1,合計售價1營收], [產品類別2,合計售價2營收] ]
     */

    productCategoryStatisticObj = apiOrderData.reduce((priceObj , item) => {

        const result = item["products"].forEach(products => {
            const thisCategory = products["category"];
            const thisCategoryPrice = Number(products["price"]) * Number(products["quantity"])

            if (thisCategory in priceObj){
                priceObj[thisCategory] += thisCategoryPrice;
            } else {
                priceObj[thisCategory] = thisCategoryPrice;
            }
            return priceObj;
            
        });

        return priceObj; // {收納: 2670, 床架: 3780}
    }, {});

    productCategoryStatistic = Object.entries(productCategoryStatisticObj);
    productCategoryStatistic.sort((a, b) =>　b[1] - a[1]); // 依照金額由大到小排序
    return productCategoryStatistic;
    
}; // end of updateProductCategoryStatistic(apiOrderData)


// 函式：生成c3.全品項營收比重資料 (productItemStatistic) 
// （圓餅圖，做全品項營收比重，類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」）
function updateProductItemStatistic(apiOrderData){
    /**
     * 產品名稱 = orders.products.title
     * 單筆產品售價 = orders.products.price * orders.products.quantity
     * (區域)物件a：{產品品項1: 合計售價1, 產品品項2: 合計售價2 ...}
     * (全域)陣列b：[[產品品項1,合計售價1營收], [產品品項2,合計售價2營收] ]
     */

    productItemStatisticObj = apiOrderData.reduce((priceObj , item) => {

        const result = item["products"].forEach(products => {
            const thisItem = products["title"];
            const thisItemPrice = Number(products["price"]) * Number(products["quantity"])
           
            if (thisItem in priceObj){
                priceObj[thisItem] += thisItemPrice;
            } else {
               priceObj[thisItem] = thisItemPrice;
            }
            return priceObj;
            
        });
        return priceObj; 
    }, {});

    productItemStatistic = Object.entries(productItemStatisticObj);
    productItemStatistic.sort((a, b) =>　b[1] - a[1]); // 將陣列依照金額，由大排序到小，

    // 如果品項大於3，才合併4開始為其它
    
    if (productItemStatistic.length > 3){
        let otherItemSum = 0;
        // 計算從第四筆開始以後的金額加總
        for (let i = 3; i <= productItemStatistic.length - 1; i++){
            otherItemSum += productItemStatistic[i][1];
        };
        // 刪除第四筆開始的資料，並插入新陣列
        productItemStatistic.splice(3, productItemStatistic.length-3, ['其他', otherItemSum] )
    };

    return productItemStatistic;
    

}; // end of updateProductItemStatistic(apiOrderData)

// 函式：生成c3.圓餅圖  
function createStatisticChart(statisticData) {
    if (!chartGraphic) {
        // 如果是新載入網頁，chart還未被定義，才使用c3.generate生成
        chartGraphic = c3.generate({
            bindto: '#chartData',
            data: {
                columns: statisticData,
                type : 'pie',
            },
            transition: {
                duration: 0 // 將持續時間設為 0 毫秒，立即顯示，禁用所有動畫
                // 或者 duration: 50，讓它非常快地出現
            },
            donut: {
                //title: "",
                width: 20, // 數值越小，圓環越細
                label: {
                    show: false,
                    /**format: function (value, ratio, id) {
                        // 計算百分比 (保留兩位小數)
                        const percentage = (ratio * 100).toFixed(2) + '%'; 
                        const formattedValue = value.toLocaleString('en-US'); 
                        // 使用 \n 換行
                        return `${percentage}\nNT$ ${formattedValue}`;  
                    }
                    */
                    
                },
            },

            size: {
                height: 200, // 增加高度
                width: 350   // 增加寬度
            },
            legend: {
                position: 'right' 
                // 預設是顯示在底部,
            },
            color: {
                pattern: ['#5434A7', '#9D7FEA', '#DACBFF', '#c3b6c6ff']// 示例顏色，請根據您的設計圖調整
            }
        });
    } else {
         // 如果chart已經生成，那只需要chart.load更新資料(減少效能))
        chartGraphic.load({
            columns: statisticData, // 更新成新的數據
            unload: true // 因為數據來源變了，要卸卸載的數據
        });
    }
}; // end of createStatisticChart(statisticData)


// 監聽：切換統計類別
function changeChartType(){
    chartWrapTitle.addEventListener('change', event => {
        const clickElement = event.target;
        if  (clickElement.type === 'radio' &&  clickElement.name === 'radioStatistic'){
            currentChartType(); // 函式：根據當前的統計方式決定要生成何種圓餅圖 

            /** 
            const selectedStatistic = clickElement.id;

            if (selectedStatistic === 'radioProductCategory'){
                sectionTitle.innerHTML = '全產品類別營收比重'
                createStatisticChart(productCategoryStatistic);
            } else if (selectedStatistic === 'radioProductItem') {
                console.log(selectedStatistic)
                sectionTitle.innerHTML = '全品項營收比重'
                createStatisticChart(productItemStatistic);
            }
            */
        }
    });
}; // end of changeChartType()

// 函式：根據當前的統計方式決定要生成何種圓餅圖 
function currentChartType(){
    // 利用css偽元素確認被選中的選項
    const clickElement = document.querySelector('input[name="radioStatistic"]:checked');
    
    if (clickElement){
        const selectedStatistic = clickElement.id;
        if (selectedStatistic === 'radioProductCategory'){
            sectionTitle.innerHTML = '全產品類別營收比重'
            createStatisticChart(productCategoryStatistic);
        } else if (selectedStatistic === 'radioProductItem') {
            sectionTitle.innerHTML = '全品項營收比重'
            createStatisticChart(productItemStatistic);
        }
    } else {
        return null;
    }

}; //end of currentChartType()


/** =====主程式 + 初始化======= */
(async function() {

    await apiGetOrderList();  // api：取得訂單列表 + 前端渲染

    createStatisticChart(productCategoryStatistic); // 生成c3圓餅圖(預設為產品類別)

    toggleDeleteAllOrder(apiOrderData); // 執行  ## 函式：訂單表格為空時，將清除全部訂單按鈕disable 

    clickOrderTable(); // 訂單列表共同監聽器

    clickDeleteAllOrder(); // 監聽：清除全部訂單

    changeChartType(); // 監聽：切換統計方式



})();