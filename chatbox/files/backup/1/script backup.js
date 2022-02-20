var curr_talk_id=0;
var curr_talk_img = "";
var curr_talk_name="";
var chat_box = document.getElementsByClassName('chat-box')[0];
var dont_update_text = false;

var textarea = document.getElementsByClassName('talk-text')[0];
var mic_icon = document.getElementsByClassName("mic")[0];
var send_icon = document.getElementsByClassName("send")[0];
var summon_chat_div = document.getElementsByClassName("summon-chats")[0];
var talk_pic = document.getElementsByClassName('talk-header-img')[0];
var talk_name = document.getElementsByClassName('talk-header-username')[0];
var talk_link = document.getElementsByClassName('talk-header-link')[0];
var emogie_div= document.getElementsByClassName("footer-emogies-div")[0];
var talk_main= document.getElementsByClassName("talk-main")[0];
var last_key;
var last_talk_chat_id;
var last_left_chat_id;
var chat_type;
var just_sent = false;
var avoid_bottom_btn = false;
var notif_audio = document.getElementById("notif-audio");

window.onload = function(){
    if(send_message_username != ""){
        
        let message = prompt(`You are sending a message to ${send_message_username}, Write the messsage: `);

        if(message){

        let xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST","sendmessage.php",true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`talk_usr_name=${send_message_username}&text=${message}`);
        setTimeout(function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            new_chats()
            

        };},200)
        }
        
        window.history.pushState("object or string", "Title", "/chatbox/index.php"); 
        

    }
    
    if(window.mobileCheck()){
        document.getElementsByClassName("container")[0].addEventListener("click", function(){
            if (!document.fullscreenElement) document.getElementsByClassName("container")[0].requestFullscreen();
        });
    }
         
}

function header_dot(){
  if(dont_update_text) dont_update_text = false;
  else dont_update_text = true;
    
}



textarea.addEventListener("keydown", e => {
    if(!mic_icon.classList.add("hidemepls")){
    mic_icon.classList.add("hidemepls")
    send_icon.classList.remove("hidemepls")}

    if(e.keyCode == 13 && last_key != 16){
        e.preventDefault();
        send_text()
    }
    last_key = e.keyCode;
})


function text_keyup(){
    if(textarea.value=="") {
        send_icon.classList.add("hidemepls")
        mic_icon.classList.remove("hidemepls")
    }
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function left_drop_btn(){
    document.getElementById("leftDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


function message_on(){
    var user_name = prompt("Write the username of the person you want to messsage: ");
    var message = prompt("Write the messsage: ");
    if(message && user_name){
    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST","sendmessage.php",true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`talk_usr_name=${user_name}&text=${message}`);
    setTimeout(function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        new_chats()
    };},200)
    }

}

function message_on_grp(){
    var user_name = prompt("Write the Name of the Group: ");
    var pass = prompt("Write its password: ");
    var message = prompt("Say something like 'Hii :)' ");

    if(message && user_name && pass){
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST","sendmessage.php",true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`talk_usr_name=${user_name}&pass=${pass}&text=${message}`);
        setTimeout(function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            new_chats()
        };},200)
    }
}

function gobottom(){
    talk_main.scrollTo(0,talk_main.scrollHeight);
    document.getElementsByClassName("go-bottom-talk-div")[0].classList.add("hidemepls");
    document.getElementsByClassName("go-bottom-exclaim")[0].classList.add("hidemepls");

}

function talk_main_scrolled(){  
   // alert(`scrollheight=${document.querySelector('.talk-main').scrollHeight}; scrollTop=${document.querySelector('.talk-main').scrollTop}; talk-offsetheight=${talk_main.offsetHeight}`)

    if(talk_main.scrollHeight == talk_main.scrollTop + talk_main.offsetHeight) {
        document.getElementsByClassName("go-bottom-talk-div")[0].classList.add("hidemepls");
        document.getElementsByClassName("go-bottom-exclaim")[0].classList.add("hidemepls");
    }
    else if(talk_main.scrollHeight > 2000 && talk_main.scrollTop + talk_main.offsetHeight < talk_main.scrollHeight -2000){
        document.getElementsByClassName("go-bottom-talk-div")[0].classList.remove("hidemepls");
    }
}

function message_on_new_grp(){
    document.getElementById("input-type").value = "GROUP";
    document.getElementById("new-grp-form").submit(); 
}

function emogie_bar(){
    if(emogie_div.classList.contains("hidemepls")){
        emogie_div.classList.remove("hidemepls")
    }
    else{
        emogie_div.classList.add("hidemepls")
    }
}

function add_emogie(x){
    textarea.value += x;
    if(!window.mobileCheck()){
        textarea.focus();
    }
    if(send_icon.classList.contains("hidemepls")){
    send_icon.classList.remove("hidemepls")
    mic_icon.classList.add("hidemepls")}
}

function attach(){
    textarea.value += '<a href="Link">Text</a>';
    if(send_icon.classList.contains("hidemepls")){
    send_icon.classList.remove("hidemepls")
    mic_icon.classList.add("hidemepls")}
}

function copy_text(chat_id){
    let text_to_copy = document.getElementsByClassName(`chat-inner-text${chat_id}`)[0].textContent;
    navigator.clipboard.writeText(`${text_to_copy}`);
}

function gobackarrow(){
    document.getElementsByClassName("container-right")[0].classList.add("mobile-hide")
    document.getElementsByClassName("container-left")[0].classList.remove("mobile-hide")
    document.getElementsByClassName(`index-msg-inner${curr_talk_id}`)[0].classList.remove("active-left-chat");
    curr_talk_id = 0;
}

function getchats(x,y,z,a){
    /*.index-msg-inner79{background-color: aliceblue;}active-left-chat
    if(window.mobileCheck()){
        document.getElementsByClassName("container")[0].requestFullscreen();
    }*/
    document.getElementsByClassName("container-right")[0].classList.remove("mobile-hide")
    document.getElementsByClassName("container-left")[0].classList.add("mobile-hide")
    if(curr_talk_id != x){
    dont_update_text = true;
    if(curr_talk_id != 0)document.getElementsByClassName(`index-msg-inner${curr_talk_id}`)[0].classList.remove("active-left-chat");
    curr_talk_id = x;
    document.getElementsByClassName(`index-msg-inner${curr_talk_id}`)[0].classList.add("active-left-chat");
    curr_talk_name = z;
    curr_talk_img = y;
    summon_chat_div.innerHTML= "";
    chat_type = a;
    talk_link.href = `/comment section/Userdatabase/user.php?usr_name=${z}`;
    talk_pic.src = y;
    talk_name.textContent = z;
    if(talk_pic.classList.contains('hidemepls')) talk_pic.classList.remove('hidemepls')

    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST","./getchats.php",true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`talk_usr_num=${x}&chat_type=${a}`);
    setTimeout(function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        dont_update_text = false;

        summon_chat_div.innerHTML = xmlhttp.responseText;
        talk_main.scrollTo(0,talk_main.scrollHeight);
        delete_unreads(x);
    };},400)}

}

function refresh_chats(){
    if(curr_talk_id!=0){
    if(!just_sent && avoid_bottom_btn == false){
        if(talk_main.scrollTop + talk_main.offsetHeight < talk_main.scrollHeight - 400){
            document.getElementsByClassName("go-bottom-talk-div")[0].classList.remove("hidemepls");
            document.getElementsByClassName("go-bottom-exclaim")[0].classList.remove("hidemepls");
            notif_audio.play()
        }
        else{
            talk_main.scrollTo(0,talk_main.scrollHeight);
        }
    }
    else{avoid_bottom_btn == true}

    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST","./getchats.php",true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`talk_usr_num=${curr_talk_id}&chat_type=${chat_type}`);
    setTimeout(function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
       if(!dont_update_text) {
           summon_chat_div.innerHTML = xmlhttp.responseText;
           if(just_sent){setTimeout(function(){talk_main.scrollTo(0,talk_main.scrollHeight);just_sent = false;},300)}
        }
    };},400)
}
}


function refresh_chats2(){

    console.log("slow connection");
    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST","./getchats.php",true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`talk_usr_num=${curr_talk_id}&chat_type=${chat_type}`);
    setTimeout(function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
       if(!dont_update_text) {
           summon_chat_div.innerHTML = xmlhttp.responseText;
           if(just_sent){setTimeout(function(){talk_main.scrollTo(0,talk_main.scrollHeight);just_sent = false;},300)}
        }
    };},2000)

}

function send_text(){
    if(curr_talk_id!=0){
    just_sent = true;

    let texto = friendly_text(textarea.value);

    if(texto != ""){

    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST","sendchats.php",true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`talk_usr_num=${curr_talk_id}&type=${chat_type}&talk_usr_name=${curr_talk_name}&talk_usr_img=${curr_talk_img}&text=${texto}`);
    setTimeout(function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        refresh_chats();
    };},200)

    textarea.value = "";
    if(!emogie_div.classList.contains("hidemepls")){
        emogie_div.classList.add("hidemepls")
    }
    send_icon.classList.add("hidemepls")
    mic_icon.classList.remove("hidemepls")
    }}
}

function send_text2(x){
    if(curr_talk_id!=0){
        just_sent = true;
    
        let texto = x;
    
        if(texto != ""){
    
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST","sendchats.php",true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`talk_usr_num=${curr_talk_id}&type=${chat_type}&talk_usr_name=${curr_talk_name}&talk_usr_img=${curr_talk_img}&text=${texto}`);
        setTimeout(function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            refresh_chats();
        };},200)
    
        textarea.value = "";
        if(!emogie_div.classList.contains("hidemepls")){
            emogie_div.classList.add("hidemepls")
        }
        send_icon.classList.add("hidemepls")
        mic_icon.classList.remove("hidemepls")
        }
    }
}

function friendly_text(x){
    x = x.replaceAll("&","!-and-!");
    return x;
}

function check_newtalk(){
    let dont_move_forward = false;
    if(curr_talk_id!=0){
    if(summon_chat_div.innerHTML != "") last_talk_chat_id = parseInt(document.getElementsByClassName("talk_id_p")[0].textContent)
    else{ dont_move_forward = true;refresh_chats2();}

    if(!dont_move_forward){
    let is_last_seen;
    if(document.getElementsByClassName("sent-icon-right")[0]) {if(document.getElementsByClassName("sent-icon-right")[0].classList.contains("sent1-icon")) is_last_seen = "false";}
    else is_last_seen ="true";
    
    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST","./files/checknewtalk.php",true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`talk_usr_num=${curr_talk_id}&chat_type=${chat_type}&last_talk_chat_id=${last_talk_chat_id}&is_last_seen=${is_last_seen}`);
    setTimeout(function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        if(!dont_update_text) {
           let response_got = xmlhttp.responseText;
           if(response_got == "true") {refresh_chats()}
           else if(response_got == "truebutnobtn"){avoid_bottom_btn=true;refresh_chats()}
        }
    };},400)
}}
}

setInterval(function(){
    check_newtalk();
},500);

function check_new_chats(){
    last_left_chat_id = parseInt(document.getElementsByClassName("left-chat-id-p")[0].textContent)
    let is_last_seen;
    if(document.getElementsByClassName("sent-icon-left")[0].classList.contains("sent1-icon")) is_last_seen = "false";
    else is_last_seen ="true";
    
    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST","./files/checknewchat.php",true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`talk_usr_num=${curr_talk_id}&last_left_chat_id=${last_left_chat_id}&is_last_seen=${is_last_seen}`);
    setTimeout(function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        if(!dont_update_text) {
           let response_got = xmlhttp.responseText;
           if(response_got == "true") {notif_audio.play();new_chats()}
           else if(response_got == "truebutnonotif"){new_chats()}
           else if(response_got == "truebutonlychangedseen"){new_chats()}
        }
    };},400)
}
     

function new_chats(){
    let xmlhttp=new XMLHttpRequest();
    xmlhttp.open("POST","checknew.php",true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`last_chat_id=${last_chat_id}`);
    setTimeout(function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        chat_box.innerHTML = xmlhttp.responseText;
        document.getElementsByClassName(`index-msg-inner${curr_talk_id}`)[0].classList.add("active-left-chat");
        for(let i=0;i<document.getElementsByClassName("index-msg-outer").length;i++){
           let id_from_p = document.getElementsByClassName("chat-id-p")[0].textContent;
           if(document.getElementsByClassName(`unreads-p${id_from_p}`).length-1>=0){
           document.getElementsByClassName(`unreads${id_from_p}`)[0].textContent = document.getElementsByClassName(`unreads-p${id_from_p}`)[document.getElementsByClassName(`unreads-p${id_from_p}`).length-1].textContent;
           }
        }
    };},400)
}

setInterval(function(){
    //new_chats();
    check_new_chats()
},2000)

setInterval(new_chats,60000)

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
