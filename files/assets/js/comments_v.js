function post(url, callback, errortext) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    var form = new FormData()
    form.append("formkey", formkey());
    xhr.withCredentials=true;
    xhr.onerror=function() { alert(errortext); };
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback();
        } else {
            xhr.onerror();
        }
    };
    xhr.send(form);
};

function post_toast3(url, button1, button2) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    var form = new FormData()

    if(typeof data === 'object' && data !== null) {
        for(let k of Object.keys(data)) {
                form.append(k, data[k]);
        }
    }


    form.append("formkey", formkey());
    xhr.withCredentials=true;

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
            myToast.show();
            try {
                document.getElementById('toast-post-success-text').innerText = JSON.parse(xhr.response)["message"];
            } catch(e) {
                document.getElementById('toast-post-success-text').innerText = "Action successful!";
            }
            return true

        } else if (xhr.status >= 300 && xhr.status < 400) {
            window.location.href = JSON.parse(xhr.response)["redirect"]
        } else {

            try {
                data=JSON.parse(xhr.response);
            } catch(e) {}

            var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
            myToast.hide();
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
            myToast.show();
            document.getElementById('toast-post-error-text').innerText = "Error. Try again later.";
            return false
        }
    };

    xhr.send(form);

    document.getElementById(button1).classList.toggle("d-md-inline-block");
    document.getElementById(button2).classList.toggle("d-md-inline-block");
}

report_commentModal = function(id, author) {

document.getElementById("comment-author").textContent = author;

document.getElementById("reportCommentButton").onclick = function() {

    this.innerHTML='<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Reporting comment';
    this.disabled = true;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/flag/comment/'+id, true);
    var form = new FormData()
    form.append("formkey", formkey());
    form.append("reason", document.getElementById("reason-comment").value);

    xhr.withCredentials=true;

    xhr.onload=function() {
        document.getElementById("reportCommentFormBefore").classList.add('d-none');
        document.getElementById("reportCommentFormAfter").classList.remove('d-none');
    };

    xhr.onerror=function(){alert(errortext)};
    xhr.send(form);
}

};

document.getElementById('reportCommentModal').addEventListener('hidden.bs.modal', function () {

var button = document.getElementById("reportCommentButton");

var beforeModal = document.getElementById("reportCommentFormBefore");
var afterModal = document.getElementById("reportCommentFormAfter");

button.innerHTML='Report comment';
button.disabled= false;
afterModal.classList.add('d-none');

if ( beforeModal.classList.contains('d-none') ) {
    beforeModal.classList.remove('d-none');
}

});

function openReplyBox(id) {
    const element = document.getElementById(`reply-to-${id}`);
    element.classList.remove('d-none')

    element.getElementsByTagName('textarea')[0].focus()
}

toggleEdit=function(id){
    comment=document.getElementById("comment-text-"+id);
    form=document.getElementById("comment-edit-"+id);
    box=document.getElementById('comment-edit-body-'+id);
    actions = document.getElementById('comment-' + id +'-actions');

    comment.classList.toggle("d-none");
    form.classList.toggle("d-none");
    actions.classList.toggle("d-none");
    autoExpand(box);
};


function delete_commentModal(id) {

    document.getElementById("deleteCommentButton").onclick = function() {	

        this.innerHTML='<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Deleting comment';	
        this.disabled = true; 
        post('/delete/comment/' + id,
            callback = function() {

                location.reload();
            }
            )
    }

};


post_comment=function(fullname){


    var form = new FormData();

    form.append('formkey', formkey());
    form.append('parent_fullname', fullname);
    form.append('submission', document.getElementById('reply-form-submission-'+fullname).value);
    form.append('body', document.getElementById('reply-form-body-'+fullname).value);
    form.append('file', document.getElementById('file-upload-reply-'+fullname).files[0]);
    var xhr = new XMLHttpRequest();
    xhr.open("post", "/comment");
    xhr.withCredentials=true;
    xhr.onload=function(){
        if (xhr.status==200) {
            commentForm=document.getElementById('comment-form-space-'+fullname);
            commentForm.innerHTML=JSON.parse(xhr.response)["html"];
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
            myToast.hide();
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
            myToast.show();
        }
        else {
            var commentError = document.getElementById("comment-error-text");
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
            myToast.hide();
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
            myToast.show();
            commentError.textContent = JSON.parse(xhr.response)["error"];
        }
    }
    xhr.send(form)

    document.getElementById('save-reply-to-'+fullname).classList.add('disabled');

}

post_reply=function(id){

    var form = new FormData();

    form.append('formkey', formkey());
    form.append('parent_id', id);
    form.append('body', document.getElementById('reply-form-body-'+id).value);
    var xhr = new XMLHttpRequest();
    xhr.open("post", "/reply");
    xhr.withCredentials=true;
    xhr.onload=function(){
        if (xhr.status==200) {
            commentForm=document.getElementById('comment-form-space-'+id);
            commentForm.innerHTML=JSON.parse(xhr.response)["html"];
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
            myToast.hide();
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
            myToast.show();
        }
        else {
            var commentError = document.getElementById("comment-error-text");
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
            myToast.hide();
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
            myToast.show();
        }
    }
    xhr.send(form)

    document.getElementById('save-reply-to-'+id).classList.add('disabled');

}

comment_edit=function(id){

    var commentError = document.getElementById("comment-error-text");

    var form = new FormData();

    form.append('formkey', formkey());
    form.append('body', document.getElementById('comment-edit-body-'+id).value);
    form.append('file', document.getElementById('file-edit-reply-'+id).files[0]);

    var xhr = new XMLHttpRequest();
    xhr.open("post", "/edit_comment/"+id);
    xhr.withCredentials=true;
    xhr.onload=function(){
        if (xhr.status==200) {
            commentForm=document.getElementById('comment-text-'+id);
            commentForm.innerHTML=JSON.parse(xhr.response)["html"];
            document.getElementById('cancel-edit-'+id).click()
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
            myToast.hide();
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
            myToast.show();
        }
        else {
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
            myToast.hide();
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
            myToast.show();
            commentError.textContent = JSON.parse(xhr.response)["error"];
        }
    }
    xhr.send(form)

    }

post_comment=function(fullname){

    var form = new FormData();

    form.append('formkey', formkey());
    form.append('parent_fullname', fullname);
    form.append('submission', document.getElementById('reply-form-submission-'+fullname).value);
    form.append('body', document.getElementById('reply-form-body-'+fullname).value);
    form.append('file', document.getElementById('file-upload-reply-'+fullname).files[0]);
    var xhr = new XMLHttpRequest();
    xhr.open("post", "/comment");
    xhr.withCredentials=true;
    xhr.onload=function(){
        if (xhr.status==200) {
            commentForm=document.getElementById('comment-form-space-'+fullname);
            commentForm.innerHTML=JSON.parse(xhr.response)["html"];
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
            myToast.hide();
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
            myToast.show();
        }
        else {
            var commentError = document.getElementById("comment-error-text");
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-success'));
            myToast.hide();
            var myToast = new bootstrap.Toast(document.getElementById('toast-post-error'));
            myToast.show();
            commentError.textContent = JSON.parse(xhr.response)["error"];
        }
    }
    xhr.send(form)

    document.getElementById('save-reply-to-'+fullname).classList.add('disabled');

}