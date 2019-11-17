class person {
    constructor() {
        this.id = undefined;
        this.name = "";
        this.picture = "";
        this.posts = [];
    }
  }
class posts { 
    constructor() {
        this.title = "";
        this.body = "";
    }
}

 async function getGender(nombre){
            return new Promise((resolve, reject)=>{
                const img_api = 'https://joeschmoe.io/api/v1/';
    let picture = undefined;
    let request_gender = new XMLHttpRequest();
    request_gender.open('GET', 'https://api.genderize.io/?name=' + nombre, false);
        request_gender.onload = () => {
            let data_gender = JSON.parse(request_gender.response);
            if (request_gender.status >= 200 && request_gender.status < 400) {
                if(data_gender.gender==='male'){
                    picture = img_api + 'jacques';
                } else {
                    picture = img_api + 'josephine';
                }
                resolve(picture);
            } else {
                picture = img_api + 'jabala';
                reject(picture);
            }
        }
        request_gender.send();

    });
}
const persons = [];
getUsers = async () => {
    const card_columns = document.getElementById('card-columns');
    let request = new XMLHttpRequest();
    request.open('GET', 'https://jsonplaceholder.typicode.com/users', true);
    request.onload = async function() {
      // Begin accessing JSON data here
      let users = JSON.parse(this.response);
      if (request.status >= 200 && request.status < 400) {

        for(let user of users){
            let tmp_user = new person();
            tmp_user.id = user.id;
            tmp_user.name = user.name;
            const card = document.createElement('div');
            card.setAttribute('class', 'card');
            
            const card_block = document.createElement('div');
            card_block.setAttribute('class','card-block');
            card_block.setAttribute('id',tmp_user.id)

            const row_header = document.createElement('div');
            row_header.setAttribute('class','row');

            const col_header_1 = document.createElement('div');
            col_header_1.setAttribute('class', 'col-md-6');

            const img_header = document.createElement('img');
        
            const col_header_2 = document.createElement('div');
            col_header_2.setAttribute('class', 'col-md-6 my-auto');
            
            const h4 = document.createElement('h4');
            h4.setAttribute('class', 'card-title');
            h4.innerText = tmp_user.name;
            let first_name = tmp_user.name.split(" ")[0];
            if(first_name.includes('.')){
                first_name = tmp_user.name.split(" ")[1];
            }
            tmp_user.picture = await getGender(first_name);
            persons.push(tmp_user);
            img_header.setAttribute('src', tmp_user.picture);
            col_header_2.appendChild(h4);
            col_header_1.appendChild(img_header);
            row_header.appendChild(col_header_1);
            row_header.appendChild(col_header_2);
            card_block.appendChild(row_header);
            card.appendChild(card_block);
            card_columns.appendChild(card);
            
        }
        const request_posts = new XMLHttpRequest();
    request_posts.open('GET', 'https://jsonplaceholder.typicode.com/posts', false);
        request_posts.onload = function() {
            let data_posts = JSON.parse(request_posts.response);
            if (request_posts.status >= 200 && request_posts.status < 400) {
                let tmpIndex = undefined;
                for(let post of data_posts){
                    tmpIndex = persons.findIndex(person => person.id === post.userId);
                    if(tmpIndex!==undefined) {
                        let tmp_post = new posts();
                        tmp_post.title = post.title;
                        tmp_post.body = post.body;
                        if(persons[tmpIndex].posts.length<4){
                            const card = document.getElementById(post.userId);
                            persons[tmpIndex].posts.push(tmp_post);
                            let text = post.body.replace('\n',' ');
                            // const row_block_title = document.createElement('p');
                            // row_block_title.setAttribute('class', 'row');
                            
                            const span_title = document.createElement('span');
                            //span_title.style.color('black');
                            span_title.innerText = tmp_post.title + '\n';

                            // const row_block_body = document.createElement('div');
                            // row_block_body.setAttribute('class', 'row');

                            const span_body = document.createElement('span');
                            //span_body.style.color('orange');
                            span_body.innerText = text + '\n';
                            span_body.setAttribute('class','b');
                            span_title.style.color = 'black';
                            span_body.style.color = 'orange';

                            // row_block_body.appendChild(span_title);
                            // row_block_title.appendChild(span_title);
                            card.appendChild(span_title);
                            card.appendChild(span_body);
                        

                        }
                        
                    }
                    
                }
            }
        }
        request_posts.send();
      } else {
        const errorMessage = document.createElement('marquee')
        errorMessage.textContent = `Gah, it's not working!`
        app.appendChild(errorMessage)
      }
    }
    
    request.send();
}
