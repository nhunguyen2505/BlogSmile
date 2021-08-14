let flag = true;
let skip = 10;
let scrollWhere = "home";
$(window).on('scroll', function() {
    var reachedBottom = $(window).scrollTop() + $(window).height() > $(document).height() * 0.99;
    let show = $(".home-page").css("display");
    let showProfile = $(".profile").css("display"); 
    if (reachedBottom && (show == "block" || showProfile == "block") && flag) {
        // get info scroll in home || profile
        // home -> load all of post , but in profile -> load more post OF PROFILE
        //set flag = false -> not scroll
        
        if(show){
            //nothing
        }else{
            scrollWhere = "profile";
        }
        
        flag = false;
        loadMorePost(skip,scrollWhere);
        //increase skip
        skip += 10;
    }
});


/*  HOME PAGE */
// load more post
function loadMorePost(skip,scrollWhere){
    // default get all post
    let profileId = "all";
    if(scrollWhere === "profile"){
        //get id profile
        //change profile
        profileId = $('#idUserMorePost').val();
    }
    $.ajax({
        url: '/get_more_post',
        type: 'POST',
        data: {skip : skip,profileId:profileId},
        success: function(data){
            
            if(data === "nodata"){
                //khong can load data nua
                flag = false;
            }else{
                //co data thi fill
                data.posts.forEach(post => { 
                    //success
                    let postDetail = "";
                    post.data.forEach(d => {
                        if(d.postType === "text"){
                            postDetail +=`<p>${d.postDetail}</p>`
                        }else if(d.postType === "img"){
                            postDetail +=`<img src="${d.postDetail}" >`
                        }else{
                            postDetail += `<iframe width="420" height="315"
                            src="https://www.youtube.com/embed/${d.postDetail}">
                                    </iframe>`
                        }
                    });
                    
                    let comments = "";
                    let aDelete = '';
                    post.comments.forEach(comment => {
                        if(comment.userID == data.user._id){
                            aDelete = `<a class="delete-comment"><span><img class="" src="images/trash.svg" width="24px"></span></a>`
                        }else{
                            aDelete= '';
                        }
                        comments+= `<div class="comment" id="${comment._id}">
                                    <a href="/profile?query=${comment.userID}">
                                        <img class="status-top-img" src="${comment.img}">
                                    </a>
                                        <div class="comment-detail">
                                        <a href="/profile?query=${comment.userID}"><p class="name">${comment.username}</p></a>
                                            <p>
                                            ${comment.commentDetail}
                                            </p>
                                        </div>
                                        ${aDelete}
                                    </div>`
                    });
    
                    let imgSrc = $('.status-top-img').attr('src');
                    
                    let option ='';
                    if (data.user.role > 0){
                        option = `<input type="hidden" id="optionComment" value="teacher">`
                    } 
                    //add ui
                    let newPost= `<div class="post" id=${post._id}>
                        <div class="post-top">
                        <a a href="/profile?query=${post.user._id}"><img class="status-top-img" src="${post.user.img } " alt=""></a>
                        <a href="/profile?query=${post.user._id}"class="post-name">${post.user.name }<br> 20 giờ</a>
                        <span class="btndropdown" ><img src="images/more.svg" class="post-option"></span>
                        <div class="list-option">
                            <ul>
                                <li class="update-post" id ="${post._id}">
                                    <span><img class="" src="images/pen.svg"></span>
                                    <a>Chỉnh sửa</a>
                                </li>
                                <li class="delete-post" id ="${post._id}">
                                    <span><img class="" src="images/trash.svg"></span>
                                    <a>Xóa</a>
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                    <div class="post-mid">
                        <div class="post-detail">
                        ${postDetail}
                        </div>
                        <div class="count-like">
                            <p>${ post.comments.length }  bình luận</p>
                        </div>
                        </div>
                        <hr>
                        <div class="post-bottom">
                            <div class="like-comment">
                                <ul>
                                    <li class="like">
                                        <img src="images/like.svg">
                                        <a>Thích</a>
                                    </li>
                                    <li class="show-comment">
                                        <img src="images/message.svg">
                                        <a >Bình luận</a>
                                    </li>
                                </ul>
                            </div>
                            <hr>
                        <div class="list-comment">
                            ${comments}
                            <hr class="hr-addcomment">
                            <div class="input-comment">
                                <img class="status-top-img" src="${imgSrc}">
                                <input type="hidden" id="postID" value="${post._id}">
                                <input type="hidden" id="userID" value="${data.user._id}">
                                ${option}
                                <div class="status-top-text">
                                    <input type="text" class="commentDetail"  placeholder="Nội dung bình luận">
                                    <a class="btn btn-comment" ><img src="images/send.svg" width="24px"></a>
                                </div>
                            </div>
                        </div>
                        </div>
                        </div>`;
    
                    
                    $('#post_more').before(newPost);
                    $(`.post#${post._id}`).setMenu();
                    $(`.post#${post._id} .like-comment`).changeLike();
                    $(`.post#${post._id} .post-bottom`).showComment();
                    $(`.post#${post._id} .post-top`).deletePost();
                    $(`.post#${post._id} .post-top`).updatePost();
                    // chỉ nên set post + id mới add tránh duplicate các post khác khi cmt
                    $(`.post#${post._id}`).commentPost();
                    
                    $('.comment').deleteComment();
                    $('#input_text').val('') 
    
                })
                flag = true;
            }
            
        },
        error: function(err){
            console.log(err);
        }
    })

}

const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)

    if(toggle && nav && bodypd && headerpd) {
        toggle.addEventListener('click', () =>{
            
            nav.classList.toggle('show')

            toggle.classList.toggle('bx-x')

            bodypd.classList.toggle('body-pd')

            headerpd.classList.toggle('body-pd')
            
        })
    }
}

showNavbar('home-header-toggle','nav-bar','body-pd','home-header')
$("#nav-bar").hover(()=>{
    $("#home-header-toggle").click();
})
const linkColor = document.querySelectorAll('.nav__link')

function colorLink(){
    if(linkColor){
        linkColor.forEach(l=> l.classList.remove('active'))
        this.classList.add('active')
    }
} 
linkColor.forEach(l=> l.addEventListener('click', colorLink))
/* END TOGGLE */
function resetFill(){
    $('#preview-upload-pic').empty();
    $('#preview-upload-pic').css({'display':'none'});
    $('#type-upload').val('');
    $('#data-upload').val('');
    $("#input_text").val('');
}
/*  OPEN MODAL STATUS */
$("#status-input").click(function(){
    let show = $(".container-modal").css("display");
    if(show ==  "none"){
        $(".wrapper").css({"height":"100vh"});
        $(".container-modal").toggleClass("active");
        $("#body-pd").toggleClass("modal-active");
        $(".home-page").css({"display": "none"});
    }
    $(".close").click(function(){
        $(".container-modal").removeClass("active");
        $("#body-pd").removeClass("modal-active")
        
        $(".home-page").css({"display": "block"});
        $(".wrapper").css({"height":"0"});
        // reset fill when close modal
        resetFill();
    })
    let input_post = $("#input_text");
    let preview = $('#preview-upload-pic');
    preview.css({'display':'block'});
    input_post.change(function(){
        let text = input_post.val();
        let youtubeId ="";
        if(text.includes("www.youtube.com") || text.includes("youtu.be")){
            //tach input => get youtube id
            preview.empty();
            $('#type-upload').val('');
            $('#data-upload').val('');
            if(text.includes("www.youtube.com")){
                youtubeId = text.split('=')[1];
            }else if(text.includes("youtu.be")){
                let temp = text.split('/');
                youtubeId = temp[temp.length - 1];
            }
            let previewYoutube = `<iframe width="420" height="315"
                                src="https://www.youtube.com/embed/${youtubeId}">
                                </iframe>`
            preview.html(previewYoutube)

        }
    })
})

/*  END MODAL STATUS */

$("#btn-update").click(function(){
    let show = $(".conform-modal").css("display");
    if(show ==  "none"){
        $(".wrapper").css({"height":"100vh"});
        $(".conform-modal").css({"display": "block"});
        $("#body-pd").toggleClass("modal-active");
        $(".profile").css({"display": "none"});
    }
    $(".close").click(function(){
        $(".conform-modal").css({"display": "none"});
        $("#body-pd").removeClass("modal-active")
        $(".profile").css({"display": "block"});
        $(".wrapper").css({"height":"0"});
    })
});

$("#btn-resetpass").click(function(){
    if($("#btn-resetpass").text() === 'Đồng ý'){
        $('.form-reset').submit();
    }else{
        $('.form-resetpass').css({'display':'block'});
        $('#btn-cancel').css({'display':'block'});
        $("#btn-resetpass").text('Đồng ý');
    }
});

$('#btn-cancel').click(function(){
    $('.form-resetpass').css({'display':'none'});
    $('#btn-cancel').css({'display':'none'});
    $("#btn-resetpass").text('Đổi mật khẩu');
});

// event create post
$("#btn-createpost").click(function(){
    /*  $('.form-createpost').submit(); */
    let input = $('#input_text').val();
    let typeUpload = $('#type-upload').val();
    let dataUpload = $('#data-upload').val();
    let arrStringfile = dataUpload.split('\t');
    let data = [];
    //check input is youtube link ?
    if(input.includes("www.youtube.com") || input.includes("youtu.be")){
        //console.log("youtube link");
        //tach input => get youtube id
        let youtubeId ;
        if(input.includes("www.youtube.com")){
            youtubeId = input.split('=')[1];
        }else if(input.includes("youtu.be")){
            let temp = input.split('/');
            youtubeId = temp[temp.length - 1];
        }
        data.push({postType: 'youtube', postDetail: youtubeId});
    }else{
        data.push({postType: 'text', postDetail: input});
    }
    
   //upload img
    if(typeUpload === 'img'){
        arrStringfile.forEach(s => {
            data.push({postType: 'img', postDetail: "images/"+s});
        });
    }
    /*ajax upload img */
    let formData = new FormData();
    let uploads = document.getElementById('upload').files;
    if(uploads.length > 0){
        for(var i = 0; i < uploads.length ; i++){
            formData.append("myfile", uploads[i])
        }
        var contentType = {
            headers : {
                "content-type":"multipart/form-data"
            }
        };
        axios.post('/multiple-upload',formData,contentType)
        .then(res => {
            //console.log(res)
        })
        .catch(err => console.log(err));
    }
   //ajax to create post 
   
    $.ajax({ 
        url: '/create_post',
        type: 'POST',
        cache: false, 
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        data: JSON.stringify(data), 
        success: function(post){
            
            $('.close').click();
        }
        , error: function(jqXHR, textStatus, err){
            console.log('text status '+textStatus+', err '+err);
        }
    })
    
});

// event delete post
$('#btn-accpect').click(function(){
    let id = $('#postID').val();
    
    $.ajax({
        type: 'DELETE',
        url: '/delete_post',
        data: {id : id},
        success: function(response){
            //console.log(response);
            let postUI = $('#'+id);
            postUI.remove();
            // close modal
            $(".conform-delete").css({"display": "none"});
            $("#body-pd").removeClass("modal-active")
            $(".home-page").css({"display": "block"});
            $(".wrapper").css({"height":"0"});
            $(".profile").css({"display": "block"});
        },
        error: function(err){
            console.log(err);
        }
    });
    
})


$('#btn-updatepost').click(function(){
    let typeUpload = $('#type-upload-update').val();
    let dataUpload = $('#data-upload-update').val();
    let arrStringfile = dataUpload.split('\t');
    let postId = $("#postId-update").val();
    let input_post = $("#input_post");
    let oldImg = $("#oldImg").val();
    let oldFileSplit = oldImg.split('\t');
    
    let dataJson ={
        "id": postId,
        "data": []
    };
    dataJson.data = [];
    //empty
    let linkYoutube = input_post.val();
    //check input is youtube link ?
    if(linkYoutube.includes("www.youtube.com") || linkYoutube.includes("youtu.be")){
        
        //tach input => get youtube id
        let youtubeId ;
        if(linkYoutube.includes("www.youtube.com")){
            youtubeId = linkYoutube.split('=')[1];
        }else if(linkYoutube.includes("youtu.be")){
            let temp = linkYoutube.split('/');
            youtubeId = temp[temp.length - 1];
        }
        dataJson.data.push({postType: 'youtube', postDetail: youtubeId});
    }else{
        // add text 
        dataJson.data.push({postType:'text',postDetail:input_post.val()});
    }


    if(typeUpload !== '' && dataUpload !== ''){
        // upload anh moi
        //console.log(" Anh moi");
        if(typeUpload === 'img'){
            arrStringfile.forEach(s => {
                dataJson.data.push({postType: 'img', postDetail: "images/"+s});
            });
        }
        let formData = new FormData();
        let uploads = document.getElementById('update_file').files;

        for(var i = 0; i < uploads.length ; i++){
            formData.append("myfile", uploads[i])
        }
        var contentType = {
            headers : {
                "content-type":"multipart/form-data"
            }
        };
        axios.post('/multiple-upload',formData,contentType)
        .then(res => {} )
        .catch(err => console.log(err));
    }else{
        // neu khong up anh moi => insert anh cu
        //console.log(" Anh cu");
        for(var i = 0; i < oldFileSplit.length - 1 ; i++){
            dataJson.data.push({postType: 'img', postDetail: oldFileSplit[i]});
        }
        
    }
    //console.log(dataJson.data)
    $('#type-upload-update').val('');
    $('#data-upload-update').val('');
    $("#oldImg").val('')
    $.ajax({
        type: 'POST',
        url: '/update_post',
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        data: JSON.stringify(dataJson),
        success: function(post){
            //console.log(post);
            let div = $('.post#'+post._id);
            let detail = div.find('.post-detail');
            let postDetail = "";
            post.data.forEach(d => {
                if(d.postType === "text"){
                    postDetail +=`<p>${d.postDetail}</p>`
                }else if(d.postType === "img"){
                    postDetail +=`<img src="${d.postDetail}" >`
                }else{
                    postDetail += `<iframe width="420" height="315"
                    src="https://www.youtube.com/embed/${d.postDetail}">
                            </iframe>`
                }
            });
            detail.html(postDetail);
            // close modal
            $('.close').click();
        },
        error: function(err){
            console.log(err);
        }
    })

})

/*  upload images */
$("#change-profile-pic").click(()=>{
    let show = $(".change_image_modal").css("display");
    $("#preview-profile-pic").css({"display":"none"});
    if(show ==  "none"){
        $(".wrapper").css({"height":"100vh"});
        $(".change_image_modal").css({"display": "block"});
        $("#body-pd").toggleClass("modal-active");
        $(".profile").css({"display": "none"});
    }
    $(".close").click(function(){
        $(".change_image_modal").css({"display": "none"});
        $("#body-pd").removeClass("modal-active")
        $(".profile").css({"display": "block"});
        $(".wrapper").css({"height":"0"});
    })
});

$("#profile-pic").change((e)=>{
    let name_img = e.target.files[0].name
    //console.log(name_img);
    $('#image_name').attr('value',name_img);
    let reader = new FileReader();
    let imgtag = $("#preview-profile-pic");
    imgtag.css({"display":"block"});
    reader.onload =  () => {
        imgtag.attr('src',reader.result)
    }
    reader.readAsDataURL(e.target.files[0]);
    
});
/*upload img post */
$('#upload_img').click(function(){
    $("#upload:hidden").trigger('click');
    $('#input_text').val('');
    let divimg = $("#preview-upload-pic");
    divimg.empty();
});
$('#update_img').click(function(){
    $("#update_file:hidden").trigger('click');
    let divimg = $("#preview-update");
    divimg.empty();
});
$('#update_file').change((e)=>{
    $('#input_text').css('height','40px');
    let divimg = $("#preview-update");
    let img_name = "";
    let names = [];
    //get list img
    for(let i = 0; i <e.target.files.length ; i++){
        (function(file) {
            names.push(file.name);
            if(i == (e.target.files.length - 1)){
                img_name += (file.name); 
            }else{
                img_name += (file.name+"\t");
            }
            var reader = new FileReader();
            let imgtag = $('<img src="">')
            reader.onload = function(e) {
                imgtag.attr('src',reader.result)
            }
            reader.readAsDataURL(file);
            divimg.append(imgtag)
        
        })(e.target.files[i]);
        
    }
    divimg.css({"display":"block"});
    $('#data-upload-update').val(img_name);
    $('#type-upload-update').val('img');
    
});
$('#upload').change((e)=>{
    $('#input_text').css('height','40px');
    let divimg = $("#preview-upload-pic");
    let img_name = "";
    let names = [];
    //get list img
    for(let i = 0; i <e.target.files.length ; i++){
        (function(file) {
            names.push(file.name);
            if(i == (e.target.files.length - 1)){
                img_name += (file.name); 
            }else{
                img_name += (file.name+"\t");
            }
            var reader = new FileReader();
            let imgtag = $('<img src="">')
            reader.onload = function(e) {
                imgtag.attr('src',reader.result)
            }
            reader.readAsDataURL(file);
            divimg.append(imgtag)
        
        })(e.target.files[i]);
        
    }
    divimg.css({"display":"block"});
    $('#data-upload').val(img_name);
    $('#type-upload').val('img');
    
});


/*dropdown toggle */
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }
});
}

// notipage 
$('#btn-createNoti').click(function(){
    $('#notiTitle').val('');
    $('#notiDetail').val('');
    $('.optionFaculty').css({'display':'block'})
    $('#btn-noti-accpect').css({'display':'block'})
    $('#save-update-noti').css({'display':'none'})
    $('#form-createNoti').css({'display':'block'});
})
$('#btn-cancelNoti').click(function(){
    $('#form-createNoti').css({'display':'none'});
    $('#notiTitle').val('');
    $('#notiDetail').val('');
})
$('#btn-delete-noti').click(function(){
    let id = $('#notiID').val();
    
    $.ajax({
        type: 'DELETE',
        url: '/delete_noti',
        data: {id : id},
        success: function(response){
            //console.log(response);
            let notiUI = $('.item#'+id);
            notiUI.remove();
            // close modal
            $(".conform-delete").css({"display": "none"});
            $("#body-pd").removeClass("modal-active")
            $(".dashboard").css({"display": "block"});
            $(".wrapper").css({"height":"0"});
            $(".profile").css({"display": "block"});
        },
        error: function(err){
            console.log(err);
        }
    });
})
$('#btn-return-dashboard').click(function(){
    location.reload();
})
$('#save-update-noti').click(function(){
    //get title and detail update
    let notiTitle = $('#notiTitle').val();
    let notiDetail = $('#notiDetail').val();
    let notiIdUpdate = $('#notiIdUpdate').val();
    //ajax update;

    $.ajax({
        url: '/update_noti',
        type: 'POST',
        data: {
            id : notiIdUpdate,
            notiTitle: notiTitle,
            notiDetail: notiDetail
        },
        success: function(res){
            if(res == "success"){
                //success
                let show = $(".success-update").css("display");
                if(show ==  "none"){
                    $(".wrapper").css({"height":"100vh"});
                    $(".success-update").css({"display": "block"});
                    $("#body-pd").toggleClass("modal-active");
                    $(".dashboard").css({"display": "none"});
                }
            }
        },
        error: function(err){
            console.log(err);
        }
    });
})
function increaseCountComment(container){
    // increase comment count UI
    let countCommentField = container.find('.count-like p');
    let count = countCommentField.text().split(' ')[0];
    let newCount = parseInt(count) + 1;
    countCommentField.text(newCount + ' bình luận');
}
function decreaseCountComment(container){
    // increase comment count UI
    let countCommentField = container.find('.count-like p');
    let count = countCommentField.text().split(' ')[0];
    let newCount = parseInt(count) - 1;
    countCommentField.text(newCount + ' bình luận');
}


jQuery.fn.extend({
    setMenu:function () {
        return this.each(function() {
            var containermenu = $(this);

            var itemmenu = containermenu.find('.btndropdown');
            itemmenu.click(function () {
                var submenuitem = containermenu.find('.list-option');
                submenuitem.slideToggle(500);

            });

            $(document).click(function (e) {
                if (!containermenu.is(e.target) &&
                    containermenu.has(e.target).length === 0) {
                     var isopened =
                        containermenu.find('.list-option').css("display");

                     if (isopened == 'block') {
                         containermenu.find('.list-option').slideToggle(500);
                     }
                }
            });



        });
    },
    changeLike:function(){
        return this.each(function(){
            var containermenu = $(this);
            var litag = containermenu.find(".like");
            litag.click(function(){
                var classnames = litag.attr('class');
                if(classnames == 'like'){
                    litag.addClass('like-active')
                    var imgtag = litag.find('img');
                    imgtag.attr("src","/images/liked.svg");
                }else{
                    litag.removeClass('like-active')
                    var imgtag = litag.find('img');
                    imgtag.attr("src","/images/like.svg");
                }
                
                
            });
        })
    },
    showComment:function(){
        return this.each(function(){
            var container = $(this);
            var litag = container.find(".show-comment");
            litag.click(function(){
                var listComment =  container.find(".list-comment");
                var inputComment = container.find(".input-comment  input");
                
                let show = listComment.css("display");
                if(show == 'none'){
                    inputComment.focus();
                    listComment.css({"display":"block"});
                }else{
                    listComment.css({"display":"none"});
                }
            });
        });
    },
    deletePost:function(){
        return this.each(function(){
            var container = $(this);
            var liTagDelete = container.find('.delete-post');
            let postId = liTagDelete[0].id;
            
            liTagDelete.click(function(){
                let show = $(".conform-delete").css("display");
                //get id from id of li tag
                if(show ==  "none"){
            
                    $(".wrapper").css({"height":"100vh"});
                    $(".conform-delete").css({"display": "block"});
                    $("#body-pd").toggleClass("modal-active");
                    $(".home-page").css({"display": "none"});
                    $(".profile").css({"display": "none"});
                    $('#postID').val(postId);
                }
                $(".close").click(function(){
                    $(".conform-delete").css({"display": "none"});
                    $("#body-pd").removeClass("modal-active")
                    $(".home-page").css({"display": "block"});
                    $(".profile").css({"display": "block"});
                    $(".wrapper").css({"height":"0"});
                })
            })


        })
    },
    updatePost:function(){
        return this.each(function(){
            let container = $(this);
            let show = $(".edit-modal").css("display");
            let liTag = container.find('.update-post');
            
            let postId = liTag[0].id;
        
            let input_post = $("#input_post");
            
           
            liTag.click(function(){
                //get textarea + preview pic
                let preview = $('#preview-update');
                preview.css({'display':'block'});
                let oldImg ="";
                //set id
                $('#postId-update').val(postId)
                //get post => fill into edit modal
                $.ajax({
                    url: '/get_post',
                    type: 'POST',
                    data: {id : postId},
                    success: function(post){
                        post.data.forEach(d => {
                            if(d.postType === "text"){
                                input_post.val(d.postDetail);
                            }else if(d.postType === "img"){
                                let img = $('<img>');
                                img.attr('src', d.postDetail);
                                oldImg += (d.postDetail+"\t");
                                preview.append(img);
                            }else{
                                let prefixYoutube = "https://youtu.be/"
                                input_post.val(prefixYoutube + d.postDetail);
                                let previewYoutube = `<iframe width="420" height="315"
                                        src="https://www.youtube.com/embed/${d.postDetail}">
                                    </iframe>`
                                preview.html(previewYoutube)
                            }
                        });

                        $("#oldImg").val(oldImg);
                        if(show ==  "none"){
                            $(".wrapper").css({"height":"100vh"});
                            $(".edit-modal").css({"display": "block"});
                            $("#body-pd").toggleClass("modal-active");
                            $(".home-page").css({"display": "none"});
                            $(".profile").css({"display": "none"});
                        }
                        $(".close").click(function(){
                            $(".edit-modal").css({"display": "none"});
                            $("#body-pd").removeClass("modal-active")
                            $(".home-page").css({"display": "block"});
                            $(".wrapper").css({"height":"0"});
                            $(".profile").css({"display": "block"});
                            preview.empty();
                        })

                        input_post.change(function(){
                            
                            let text = input_post.val();
                            let youtubeId ="";
                            if(text.includes("www.youtube.com") || text.includes("youtu.be")){
                                preview.empty();
                                //tach input => get youtube id
                                if(text.includes("www.youtube.com")){
                                    youtubeId = text.split('=')[1];
                                }else if(text.includes("youtu.be")){
                                    let temp = text.split('/');
                                    youtubeId = temp[temp.length - 1];
                                }
                                let previewYoutube = `<iframe width="420" height="315"
                                                    src="https://www.youtube.com/embed/${youtubeId}">
                                                    </iframe>`
                                preview.html(previewYoutube)
                            }

                        })
                    },
                    error: function(err){
                        console.log(err);
                    }
                })
            })
            
        })
    },
    commentPost: function(){
        return this.each(function(){
            let container = $(this);
            
            let postIDField = container.find("#postID");
            
            let userIDField = container.find("#userID");
            let optionField = container.find('#optionComment');
            let commentBtn = container.find('.btn-comment');

            
            let commentField = container.find(".commentDetail");
            let postID = postIDField.val();
            
            let userID = userIDField.val();
            let hrField = container.find(".hr-addcomment");
            commentBtn.click(function(){
                let commentDetail = commentField.val();
                let optionComment = optionField.val();
                // ajax add comment
                let data = {
                    userID: userID,
                    commentDetail: commentDetail,
                    postId : postID,
                    optionComment: optionComment
                }
                
                $.ajax({ 
                    url: '/add_comment',
                    type: 'POST',
                    cache: false, 
                    contentType:"application/json; charset=utf-8",
                    dataType:"json",
                    data: JSON.stringify(data), 
                    success: function(comment){
                        
                        
                        commentField.val('');
                     
                    },
                    error: function(jqXHR, textStatus, err){
                        //neu loi show modal 
                        let show = $(".modal-error").css("display");
                        //get id from id of li tag
                        if(show ==  "none"){
                            $(".wrapper").css({"height":"100vh"});
                            $(".modal-error").css({"display": "block"});
                            $("#body-pd").toggleClass("modal-active");
                            $(".home-page").css({"display": "none"});
                            $(".profile").css({"display": "none"});
                        }
                        $('#btn-return').click(function(){
                            location.reload();
                        })
                        $("#close-return").click(function(){
                            $(".modal-error").css({"display": "none"});
                            $("#body-pd").removeClass("modal-active")
                            $(".home-page").css({"display": "block"});
                            $(".profile").css({"display": "block"});
                            $(".wrapper").css({"height":"0"});
                            location.reload();
                        })
                    }
                })
                
            });

        })
    },
    deleteComment: function(){
        return this.each(function(){
            let container = $(this);
            let commentID = container[0].id;
            let tagDelete = container.find(".delete-comment");
            tagDelete.click(function(){
                
                $.ajax({
                    type: 'DELETE',
                    url: '/delete_comment',
                    data: {commendID : commentID},
                    success: function(postId){
                        // return postId -> get div -> decrease count comment
                    },
                    error: function(err){
                        console.log(err);
                    }
                });
            })
            
            
        });
    },
    deleteNoti:function(){
        return this.each(function(){
            var container = $(this);
            var liTagDelete = container.find('.delete-noti');
            let notiId = liTagDelete[0].id;
            
            liTagDelete.click(function(){
                
                let show = $(".conform-delete").css("display");
                //get id from id of li tag
                if(show ==  "none"){
            
                    $(".wrapper").css({"height":"100vh"});
                    $(".conform-delete").css({"display": "block"});
                    $("#body-pd").toggleClass("modal-active");
                    $(".dashboard").css({"display": "none"});
                    $(".profile").css({"display": "none"});
                    $('#notiID').val(notiId);
                }
                $(".close").click(function(){
                    $(".conform-delete").css({"display": "none"});
                    $("#body-pd").removeClass("modal-active")
                    $(".dashboard").css({"display": "block"});
                    $(".profile").css({"display": "block"});
                    $(".wrapper").css({"height":"0"});
                })
            })


        })
    },
    updateNoti:function(){
        return this.each(function(){
            var container = $(this);
            var liTagUpdate = container.find('.update-noti');
            let notiId = liTagUpdate[0].id;
            
            liTagUpdate.click(function(){
                //console.log("update noti id = " + notiId);
                let form_noti = $('#form-createNoti');
                //get noti
                $.ajax({
                    url: '/get_noti',
                    type: 'POST',
                    data: {id : notiId},
                    success: function(noti){
                        //console.log(noti);
                        let inputTitle = form_noti.find('#notiTitle');
                        let inputDetail = form_noti.find('#notiDetail');
                        let notiIdUpdate = form_noti.find('#notiIdUpdate');

                        inputTitle.val(noti.notiTitle);
                        inputDetail.val(noti.notiDetail);
                        notiIdUpdate.val(notiId);
                        $('.optionFaculty').css({'display':'none'})
                        $('#save-update-noti').css({'display':'block'})
                        $('#btn-noti-accpect').css({'display':'none'})
                        $('#form-createNoti').css({'display':'block'});
                    }
                    ,
                    error: function(err){
                        console.log(err);
                    }
                })
                
            })
        })
    }
    
});
$(".post").setMenu();
$(".like-comment").changeLike();
$(".post-bottom").showComment();
$('.post-top').deletePost();
$('.post-top').updatePost();
$('.post').commentPost();
$('.comment').deleteComment();
$('.item').setMenu();
$('.item').deleteNoti();
$('.item').updateNoti();


// socket io
const socket = io();
socket.on('connect', () => {
    //console.log('Đã kết nối socket io');
})
socket.on('disconnect', ()=> {
})
//socket on add new noti
socket.on('newNoti',(data)=>{
    let notiTitle = data.notiTitle;
    let facultyName = data.facultyName;
    let notiID = data.notiID;

    //console.log(`${facultyName} vừa đăng thông báo mới : ${notiTitle} , notiID = ${notiID}`);

    //add to UI
    let newNoti = `
            <div class="form-toast" aria-live="polite" aria-atomic="true" >
                <div class="toast" >
                  <div class="toast-header">
                    <strong class="mr-auto">Thông báo mới</strong>
                    <small>Vừa xong</small>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="toast-body">
                    ${facultyName} vừa đăng thông báo mới : <a href="/detail?id=${notiID}">${notiTitle}</a>
                  </div>
                </div>
            </div>`;
    $('.noti-table').before(newNoti);
});

//socket on add new comment
socket.on('newComment', (comment)=>{
    
    //check location user -> get id user
    let show = $(".home-page").css("display");
    let id ;
    if(show === "block"){
        //in home page
        //get user id 
        let userDiv = $('.status');
        id = userDiv[0].id;
    }else{
        //profile page
        id = $('#userIdInProfile').val();
    }
    
    //get div postid
    let container = $(`#${comment.comment.postId}`);
    //get tag hr to add new comment before that
    let hrField = container.find(".hr-addcomment");
    let deleteTag = '';
    if(id == comment.comment.userID){
        deleteTag = `<a class="delete-comment"><span><img class="" src="images/trash.svg" width="24px"></span></a>`
    }
    // create UI new comment
    let newComment = `<div class="comment" id="${comment.comment._id}">
        <a href="/profile?query=${comment.comment.userID}">
            <img class="status-top-img" src="${comment.comment.img}">
        </a>
            <div class="comment-detail">
            <a href="/profile?query=${comment.comment.userID}">
                <p class="name">${comment.comment.username}</p>
            </a>
                <p>
                    ${comment.comment.commentDetail}
                </p>
            </div>
            ${deleteTag}
        </div>`;
    hrField.before(newComment);
    //update count
    increaseCountComment(container)
    $('.comment').deleteComment()

})
//socket on delete comment
socket.on('deleteComment', (data)=>{
    
    //let postid and comment id
    let postId = data.postId;
    let commentId = data.commentId;

    let container = $(`#${postId}`);
    let commentUI = $('.comment#'+commentId);
    commentUI.remove();
    decreaseCountComment(container)

})

socket.on('createPost', (post) => {
    //success
    let postDetail = "";
    post.data.forEach(d => {
        if(d.postType === "text"){
            postDetail +=`<p>${d.postDetail}</p>`
        }else if(d.postType === "img"){
            postDetail +=`<img src="${d.postDetail}" >`
        }else{
            postDetail += `<iframe width="420" height="315"
            src="https://www.youtube.com/embed/${d.postDetail}">
                    </iframe>`
        }
    });
    
    let comments = "";
    post.comments.forEach(comment => {
        comments+= `<div class="comment" id="${comment._id}">
                        <img class="status-top-img" src="images/avatar.png">
                        <div class="comment-detail">
                            <p class="name">Tran Quoc Sanh</p>
                            <p>
                               ${comment.commentDetail}
                            </p>
                        </div>
                        <a class="delete-comment"><span><img class="" src="images/trash.svg" width="24px"></span></a>
                    </div>`
    });

    let imgSrc = $('.img_avatar_profile').attr('src');
    //get userID now to show dropdown btn
    //if user in home page
    let nowUserId = $('.status').attr('id');
    if(typeof nowUserId === 'undefined'){
        nowUserId = $('#userIdInProfile').val();
    }
    
    let tagDropdown = '';
    if(nowUserId === post.user._id){
        tagDropdown = `<span class="btndropdown" ><img src="images/more.svg" class="post-option"></span>`;
    }
    //add ui
    let newPost= `<div class="post" id=${post._id}>
        <div class="post-top">
        <a a href="/profile?query=${post.user._id}"><img class="status-top-img" src="${post.user.img } " alt=""></a>
        <a href="/profile?query=${post.user._id}"class="post-name">${post.user.name }<br> 20 giờ</a>
        ${tagDropdown}
        <div class="list-option">
            <ul>
                <li class="update-post" id ="${post._id}">
                    <span><img class="" src="images/pen.svg"></span>
                    <a>Chỉnh sửa</a>
                </li>
                <li class="delete-post" id ="${post._id}">
                    <input type="hidden" value="post2">
                    <span><img class="" src="images/trash.svg"></span>
                    <a>Xóa</a>
                </li>
                
            </ul>
        </div>
    </div>
    <div class="post-mid">
        <div class="post-detail">
           ${postDetail}
        </div>
        <div class="count-like">
            <p>${ post.comments.length }  bình luận</p>
        </div>
        </div>
        <hr>
        <div class="post-bottom">
            <div class="like-comment">
                <ul>
                    <li class="like">
                        <img src="images/like.svg">
                        <a>Thích</a>
                    </li>
                    <li class="show-comment">
                        <img src="images/message.svg">
                        <a >Bình luận</a>
                    </li>
                </ul>
            </div>
            <hr>
        <div class="list-comment">
            ${comments}
            <hr class="hr-addcomment">
            <div class="input-comment">
                <img class="status-top-img" src="${imgSrc}">
                
                <input type="hidden" id="postID" value="${post._id}">
                <input type="hidden" id="userID" value="${nowUserId}">
                <div class="status-top-text">
                    <input type="text" class="commentDetail"  placeholder="Nội dung bình luận">
                    <a class="btn btn-comment" ><img src="images/send.svg" width="24px"></a>
                </div>
            </div>
        </div>
        </div>
        </div>`;

    //check if user in user profile when they create post 
    let inProfilePage = $('.profile').css('display');
    let idUserInProfile = $('#idUserMorePost').val();
    
    if(inProfilePage === "block" && idUserInProfile === post.user._id){
        $('.card-right').after(newPost);
    }
    $('.status').after(newPost);
    $(`#${post._id}`).setMenu();
    $(`#${post._id} .like-comment`).changeLike();
    $(`#${post._id} .post-bottom`).showComment();
    $(`#${post._id} .post-top`).deletePost();
    $(`#${post._id} .post-top`).updatePost();
    $('.post').commentPost();
    $('.comment').deleteComment();
})