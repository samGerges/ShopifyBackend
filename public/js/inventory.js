async function exportInventory(){
    const target = '/inventory/export/inventory'
    fetch(target, {
        method: 'get',
        headers: {
            'content-type': 'text/csv;charset=UTF-8',
        }
    })
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        fileName = url.split("/").pop();
        a.download = fileName;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();  //afterwards we remove the element again         
    });
}

async function exportHistory(){
    const target = '/inventory/export/history'
    fetch(target, {
        method: 'get',
        headers: {
            'content-type': 'text/csv;charset=UTF-8',
        }
    })
    .then(response => response.blob())
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        fileName = url.split("/").pop();
        a.download = fileName;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();  //afterwards we remove the element again         
    });
}