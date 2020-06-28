
/** 2차 프로젝트 **/
//        범용화 함수
function f_setNone(p_tag, p_tag2) {
    if (!p_tag2) {
        $(p_tag).attr("style", "display:none");     
    } else {   
        $(p_tag).attr("style", "display:none");     
        $(p_tag2).attr("style", "display:none");     
    }
}
function f_setBlock(p_tag, p_tag2) {
    if (!p_tag2) {
        $(p_tag).attr("style", "display:block");               
    } else {
        $(p_tag).attr("style", "display:block");               
        $(p_tag2).attr("style", "display:block");                       
    }
}


//      메뉴 애니메이션 부여
function f_menuAni() {
    var v_menu = document.getElementsByName("nm_menu");      
        for (var i = 0; i < v_menu.length; i++) {
        // 마우스 올라갓을때
        v_menu[i].onmouseover = function () {
            event.target.style.color = "navy";
            event.target.style.background = "linear-gradient(45deg, white, skyblue )";
            event.target.style.border = "1px dashed midnightblue"
        };
        // 마우스 나갔을때
        v_menu[i].onmouseout = function () {
            event.target.style.color = "black";
            event.target.style.background = "";
            event.target.style.border = ""
        };               
    }        
}

//      작은 이미지들 생성
function f_imgCreate(p_length) {
    var v_idx = 0;
    var v_array = [];
    for (var i = 0; i < p_length * 2; i++) {
        var v_imgPath = "images/사진"+(v_idx+1)+".jpg"
        var v_leftVal = "left:" + (160 * i) + "px;";
        var v_img = document.createElement("img");
        v_img.setAttribute("src", v_imgPath);
        v_img.setAttribute("width", 130);
        v_img.setAttribute("height", 100);
        v_img.setAttribute("style", v_leftVal);       
        v_array.push(v_img);        

        if ((p_length - 1) == v_idx ) {
          v_idx = 0;
        } else {
          v_idx++;            
        }
    }
    return v_array;
}

//      작은 이미지들 이동시키는 함수
var v_mvLeft = 0;
function f_imgMv(p_length) {
    var v_imgListStyle = document.getElementById("id_imgList").style;
    v_mvLeft -= 0.5;
    v_imgListStyle.left = v_mvLeft + "px";
    if ((v_imgListStyle.left % 160) == 0) {
        $("#id_imgList").eq(0).appendTo($("#id_imgList").eq(0));
    }
    if (v_mvLeft < -3040) {
        for (var i = 0; i < p_length; i++) {
        $("#imgList").append($("#imgList").eq(0));
        }
        v_mvLeft = 0;          
    }
    setTimeout(f_imgMv, 10);
}

//      작은 이미지에 마우스올리면 크게 보여주는 함수
function f_imgBlowUp(p_toggle) {
    if (!p_toggle) {
        $("#id_imgList > img").on("mouseover", function () {
            document.getElementById("id_mainImg").src = "";
            $("#id_mainImg").attr("style", "display:none;");
        });          
    } else {
        $("#id_imgList > img").on("mouseover", function () {
            document.getElementById("id_mainImg").src = event.target.src;
            $("#id_mainImg").attr("style", "display:block;");
        });          
    }
}

//      큰 이미지 클릭 시 배경화면으로 설정해주고 큰 이미지 안보이게
function f_wallPaperSet() {
    $("#id_mainImg").add("img").on("click", function () {
        // console.log(decodeURIComponent($("#id_mainImg")[0].src));
        // 배경화면
        $("body > img").attr("src", decodeURIComponent(this.src));
        $("body > img").attr("style", "display:block;");
        // 큰이미지
        $("#id_mainImg").attr("src", "");
        $("#id_mainImg").attr("style", "display:none;");

        var v_bodyImg = document.getElementById("id_bodyImg").src;

        localStorage.setItem("src", v_bodyImg);
    })  
}



function f_clkPost(p_toggle) {    
  if (!p_toggle) {
    return;
  } else {          
    $("#id_mainImg").attr("style", "display:none;");
    f_setBlock($(".cl_newWrite"));
    f_imgBlowUp(false);
    
    $.ajax({
      method : "get",
      url : "public/tableData.json",
      success : function (p_json) {
        var v_array = [];
        for (var i = p_json.num.length - 1; i >= 0 ; i--) {
          var v_json = {};
          v_json.num = p_json.num[i];
          v_json.pass = p_json.pass[i];
          v_json.title = p_json.title[i];
          v_json.content = p_json.content[i];
          v_json.writer = p_json.writer[i];
          v_json.regDate = p_json.regDate[i];
          v_json.hits = p_json.hits[i];      
          v_array.push(v_json);          
        }
        localStorage.setItem("post", JSON.stringify(v_array));

        f_setBlock($("#id_table"), $("#id_paging"));
        $("#id_table").html( f_mkTbl(1, p_json) );    
        $("#id_paging").html( f_mkPage() );    
      }                   
    })
  }
}
//        페이지 만드는 함수
function f_mkPage() {    
    var v_postJSON = JSON.parse(localStorage.getItem("post"));
    var v_curPage = 1;
    var v_paging = "";
    v_paging += "<div class='text-center'><ul class='pagination'>";
    var v_pageSize = Math.ceil(v_postJSON.length / 10);
    for (var i = 1; i <= v_pageSize; i++) {
      if (v_curPage == i) {
        v_paging += "    <li><a href='#' onclick='f_selPage(this)'>" + i + "</a></li>";                  
      } else {
        v_paging += "    <li><a href='#' onclick='f_selPage(this)'>" + i + "</a></li>";      
      }
    }
    v_paging += "</ul></div>";
    return v_paging;
}

//      페이지 선택해주는 함수
function f_selPage(p_this) {
  // console.log(JSON.parse(localStorage.getItem("post")));
  var v_tmp = JSON.parse(localStorage.getItem("post"));
  $("#id_table").html( f_selTbl(p_this.innerHTML, v_tmp) );    
}

//      테이블 만드는 함수(페이지수, json)
function f_mkTbl(p_page, p_json) {
  var v_end = (p_json.num.length - 1) - ((p_page - 1) * 10);
  var v_start = v_end - 10;
  var v_width = ["10%", "10%", "47%", "10%", "15%", "8%"];
  var v_table = "<table class='table table-hover'><tr>";
  var v_colArray = [];
  for (var i = 0; i < p_json.column.length; i++) {
    v_table += "<th style='width:" +v_width[i] + "; text-align:center;background-color:rgba(0,0,0,0.8);color:white;'>" +
      p_json.column[i] + "</th>"              
    v_colArray.push(p_json.column[i]);
  }
  localStorage.setItem("col", JSON.stringify(v_colArray));
  v_table += "</tr>";
  for (var i = v_end; i > v_start; i--) {
    v_table += "<tr onclick='f_clkTitle(this)'><td style='text-align:center;'>" + p_json.num[i] + "</td>" +
    "<td style='text-align:center;'><div class='glyphicon glyphicon-tent'></div></td>" +
    "<td style='font-weight:bold;'><a href='#' style='color:black;'>" + p_json.title[i] + "</a></td>" + 
    "<td style='text-align:center;'>" + p_json.writer[i] + "</td>" +
    "<td style='text-align:center;'>" + p_json.regDate[i] + "</td>" +
    "<td style='text-align:center;'>" + p_json.hits[i] + "</td></tr>";                     
  }
  v_table += "</table>";
  return v_table;
}


//      페이지 인식하는 함수
function f_selTbl(p_page, p_array) {
    var v_start = (p_page - 1) * 10;
    if (p_page == 1) v_start = 0;
    var v_end = v_start + 10;
    if(v_end > p_array.length) v_end = p_array.length;
    var v_width = ["10%", "10%", "47%", "10%", "15%", "8%"];
    var v_table = "<table class='table table-hover'><tr>";
    var v_col = JSON.parse(localStorage.getItem("col"));
    for (var i = 0; i < v_col.length; i++) {
    v_table += "<th style='width:" +v_width[i] + "; text-align:center;background-color:rgba(0,0,0,0.8);color:white;'>" +
        v_col[i] + "</th>"              
    }
    v_table += "</tr>";
    for (var i = v_start; i < v_end; i++) {
    v_table += "<tr onclick='f_clkTitle(this)'><td style='text-align:center;'>" + p_array[i].num + "</td>" +
    "<td style='text-align:center;'><div class='glyphicon glyphicon-tent'></div></td>" +
        "<td style='font-weight:bold;'><a href='#' style='color:black;'>" + p_array[i].title + "</a></td>" + 
        "<td style='text-align:center;'>" + p_array[i].writer + "</td>" +
        "<td style='text-align:center;'>" + p_array[i].regDate + "</td>" +
        "<td style='text-align:center;'>" + p_array[i].hits + "</td></tr>";            
    }
    v_table += "</table>";
    return v_table;
}


//      tblView 구현
function f_clkTitle(p_tr) {
  f_setBlock($("#id_disp"), $(".cl_btns > button").eq(1));
  f_setBlock($(".cl_btns > button").eq(0), $(".cl_btns > button").eq(2));
  f_setNone($("#id_table"), $("#id_paging"));
  f_setNone($(".cl_btns > button").eq(3), $(".cl_newWrite"));
  localStorage.setItem("postTog", "false");
  var v_post = JSON.parse(localStorage.getItem("post"));
  // console.log(v_post.length - $(p_tr).find("td").eq(0).html());  
  var v_selNum = v_post.length - $(p_tr).find("td").eq(0).html();
  var v_selNarr = v_post[v_selNum];
  sessionStorage.setItem("selNum", $(p_tr).find("td").eq(0).html());
  // 조회수 증가
  v_post[v_selNum].hits = v_post[v_selNum].hits + 1;
  localStorage.setItem("post", JSON.stringify(v_post));
  // console.log(v_selNarr.title);
  $(".cl_title").eq(0).html(v_selNarr.title);
  $(".cl_content").eq(0).html(v_selNarr.content);        
  $(".cl_userInfo").eq(0).html("Writer : " + v_selNarr.writer + " // RegDate : " + v_selNarr.regDate + " // Hits : " + v_selNarr.hits);

}

//      View에서 목록으로 돌아가기
function f_clkRtn() {
  f_setNone($("#id_disp"), $(".cl_btns > button").eq(1));
  f_setBlock($("#id_paging"), $("#id_table"));        
  f_setBlock($(".cl_newWrite"));
  $("#id_table").html(f_selTbl(1, JSON.parse(localStorage.getItem("post"))));   
  $("#id_paging").html( f_mkPage() );    
  f_setNone($(".cl_btns > button").eq(4));
  $("#id_disp > h2").eq(0).html("Title");
  $("#id_disp > h2").eq(1).html("Content");
}





//      글쓰기 구현
function f_clkWrite() {
    f_setBlock($("#id_disp"));
    f_setNone($("#id_table"), $("#id_paging"));
    f_setNone($(".cl_btns > button").eq(0));
    f_setNone($(".cl_btns > button").eq(2));
    localStorage.setItem("postTog", "false");
    var v_title = "<input type='text' id='id_newTitle' placeholder='Insert title' style='width:59%' required/>";
    var v_content = "<textarea id=' id_content' name='ckEditor'></textarea>";
    var v_pass = "<input type='text'id='id_newPass' placeholder='Insert password' required/>";
    var v_writer = "<input type='text' id='id_newWriter' placeholder='Insert your name' required/>";
    $(".cl_title").eq(0).html("<h4>Title&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + v_title + "<br><br>" + 
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Writer " + v_writer + "&nbsp;&nbsp;&nbsp;&nbsp;" +
       "Password " + v_pass + "</h4>");
    // Title, Content 글씨 사라지게
    f_setNone($("#id_disp > hr").eq(0));
    $("#id_disp > h2").eq(0).html("");
    $("#id_disp > h2").eq(1).html("");
    $(".cl_userInfo").html("");
    $(".cl_content").eq(0).html(v_content);  
    f_setBlock($(".cl_btns > button").eq(3));
    // 여기까지 추가사항
    CKEDITOR.replace( 'ckEditor', {
        width : 937,
        height: 200,
        filebrowserUploadUrl: "/jsstudy/freeBoard/serverPhp.php?type=file",
        filebrowserImageUploadUrl: "/jsstudy/freeBoard/serverPhp.php?type=image"            
    });

  }
//      새 입력값 localStorage 에 넣기
  function f_clkNew(p_content) {        
    if(!$("#id_newPass").val() || !$("#id_newTitle").val() || !$("#id_newWriter").val()) {
      alert("빈 칸을 입력해주세요.");
      return;
    }
    var v_post = JSON.parse(localStorage.getItem("post"));
    // var v_selNarr = v_post[v_post.length - $(p_tr).find("td").eq(0).html()];
    // console.log($("#id_newTitle").val() + " " + $("#id_newPass").val() + " " + $("#id_newWriter").val() + " " );
    // console.log(document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML);
    var v_json = {};
    v_json.num = v_post[0].num + 1;
    v_json.pass = $("#id_newPass").val();
    v_json.title = $("#id_newTitle").val();
    v_json.content = document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML;
    v_json.writer = $("#id_newWriter").val();
    var date = new Date() + "";
    v_json.regDate = date.substr(4, 11);
    v_json.hits = 1;

    v_post.unshift(v_json);
    localStorage.setItem("post", JSON.stringify(v_post));

    // 원상복구
    localStorage.setItem("postTog", "true");
    f_setNone($("#id_disp"));
    f_setBlock($("#id_table"), $("#id_paging"));
    f_setBlock($("#id_disp > hr").eq(0));
    $("#id_disp > h2").eq(0).html("Title");
    $("#id_disp > h2").eq(1).html("Content");
    // $(".cl_userInfo").html("");
    $(".cl_content").eq(0).html("");  
    f_setNone($(".cl_btns > button").eq(2));

    alert("글 등록 성공!");
    
    f_clkRtn();
  }
//      글 지우기
  function f_clkDel() {
    var v_post = JSON.parse(localStorage.getItem("post"));
    var v_selNum = v_post.length - JSON.parse(sessionStorage.getItem("selNum"));
    console.log(v_selNum);
    v_post.splice(v_selNum, 1);

    localStorage.setItem("post", JSON.stringify(v_post));        
    alert("삭제되었습니다!");

    f_clkRtn();
  }

//      글 수정하기
  function f_clkMod() {
    f_setNone($("#id_table"), $("#id_paging"));
    f_setNone($(".cl_btns > button").eq(1), $(".cl_btns > button").eq(2));
    f_setBlock($(".cl_btns > button").eq(4));
    $("#id_new").attr("disabled", true);
    localStorage.setItem("postTog", "false");

    var v_post = JSON.parse(localStorage.getItem("post"));
    var v_selNum = v_post.length - JSON.parse(sessionStorage.getItem("selNum"));

    var v_title = "<input type='text' value="+v_post[v_selNum].title+" id='id_newTitle' style='width:59%' />";
    var v_content = "<textarea id='id_content' name='ckEditor'>" + v_post[v_selNum].content + "</textarea>";
    var v_pass = "<input type='text' value="+v_post[v_selNum].pass+" id='id_newPass' />";
    var v_writer = "<input type='text' value="+v_post[v_selNum].writer+" id='id_newWriter' />";
    $(".cl_title").eq(0).html("<h4>Title&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + v_title + "<br><br>" + 
      "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Writer " + v_writer + "&nbsp;&nbsp;&nbsp;&nbsp;");
      // +"Password " + v_pass + "</h4>");
    // Title, Content 글씨 사라지게
    f_setNone($("#id_disp > hr").eq(0));
    $("#id_disp > h2").eq(0).html("");
    $("#id_disp > h2").eq(1).html("");
    $(".cl_userInfo").html("");
    $(".cl_content").eq(0).html(v_content);  
    f_setBlock($(".cl_btns > button").eq(3));
    // 여기까지 추가사항
    CKEDITOR.replace( 'ckEditor', {
        width : 937,
        height: 200,
        filebrowserUploadUrl: "/jsstudy/freeBoard/serverPhp.php?type=file",
        filebrowserImageUploadUrl: "/jsstudy/freeBoard/serverPhp.php?type=image"            
    });
  }

  function f_modComplete() {    

    var v_post = JSON.parse(localStorage.getItem("post"));
    var v_selNum = v_post.length - JSON.parse(sessionStorage.getItem("selNum"));
    f_setNone($(".cl_btns > button").eq(4));
    $("#id_new").attr("disabled", false);
    localStorage.setItem("postTog", "true");
    $("#id_disp > h2").eq(0).html("Title");
    $("#id_disp > h2").eq(1).html("Content");

    
    v_post[v_selNum].title = document.getElementById("id_newTitle").value;
    v_post[v_selNum].content = document.getElementsByTagName("iframe")[0].contentDocument.body.innerHTML;
    v_post[v_selNum].writer = document.getElementById("id_newWriter").value;

    localStorage.setItem("post", JSON.stringify(v_post));
    alert("수정이 완료되었습니다!");
    
    f_clkRtn();
  }


























/** 1차 프로젝트 **/
function f_newSignUp(p_path) {
    if (!p_path) {
        window.open("회원가입.html", "signUp", "width=400,height=600, left=100, top=100");   
    } else {
        window.open(p_path + "회원가입.html", "signUp", "width=400,height=600, left=100, top=100");        
    }
}

function f_newLogin(p_path) {
    if (!p_path) {
        window.open("로그인.html", "login", "width=400,height=600, left=100, top=100");   
    } else {
        window.open(p_path + "로그인.html", "login", "width=400,height=600, left=100, top=100");  
    }
}

function f_exit() {
    window.close();
}

function f_modalAlert() {
    v_mo.style.display = "none"
    v_moCh.style.display = "none"           
}

function f_logout() {
    sessionStorage.clear();
    document.getElementById("id_menu2").innerHTML = "<a href='' onclick='f_newLogin('public/')'>로그인</a>";          
    document.getElementById("id_menu4").innerHTML = "";
}

function f_pwBlind(p_val) {    
    var v_tmp = "";
    for(var i=0; i<p_val.length; i++) {                
        v_tmp += "*";
    }
    return v_tmp;
}

function f_repeatChk(p_arr) {
    var v_chk = true;
    for (var i=0; i<p_arr.length; i++) {
        if (!p_arr[i].checked) {
            v_chk = false;
            break;
        }                    
        return v_chk;
    }
}

function f_statusChk() {       
    if (sessionStorage.key(0)) {
        var v_mem = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
        document.getElementById("id_menu2").innerHTML = "<a href='#' onclick='f_logout()'>로그아웃</a>";          
        document.getElementById("id_menu4").innerHTML = v_mem.name + "님 반갑습니다.";            
    }
}
// 여우 이미지 버튼으로 나타내기
function f_imgView() {
    var v_imgBtn = document.getElementById("id_imgBtn");
    var v_imgFox = document.getElementById("id_imgFox");
    
    v_imgBtn.style.display = "none";
    v_imgFox.style.display = "block";            
}

function f_getName() {
    if (sessionStorage.key(0)) {
        var v_mem = JSON.parse(sessionStorage.getItem(sessionStorage.key(0)));
        return v_mem.name + "님";
    }  else {
        return "당신";
    }
}

var v_deg = 0;
function f_spin() {
    var v_disp = document.getElementById("id_disp");
    v_deg += 1;
    v_disp.style.transform = "rotate(180deg) rotateY(" + v_deg  + "deg)";
    if (v_deg >= 360) v_deg=0;  

    setTimeout(f_spin, 10);    
}

function f_triMake() {      
    var v_disp = document.getElementById("id_disp");
    var v_max = 11;
    v_disp.innerHTML = "";
    for (var i=1; i<=v_max; i++) {
        for (var j=1; j<=i*2 - 1; j++) { 
            if(i == 11) {
                j += 0.25;
                if(18>j && j>3) {
                    v_disp.appendChild(retDiv("")); 
                    j++;
                } else {
                    v_disp.appendChild(retDiv("*"));    
                }
            } else if (i == 10) { 
                j += 0.25;
                if(14>j && j>7) {
                    v_disp.appendChild(retDiv("")); 
                    j++;
                } else {
                    v_disp.appendChild(retDiv("*"));    
                }
            } else if (i == 9) {
                j += 0.1;
                v_disp.appendChild(retDiv("*"));          
            } else {    
                v_disp.appendChild(retDiv("*"));          
            }
        }            
    v_disp.innerHTML += "<br>";
    }
    setTimeout(f_triMake, 500);
}

function retColor() {
    var v_red = Math.round(Math.random() * 255);
    var v_green = Math.round(Math.random() * 255);
    var v_blue = Math.round(Math.random() * 255);
    var v_alpha = "0." + Math.round(Math.random() * 9);
    if(v_alpha == "0.0") v_alpha = "1";
    return "rgba(" + v_red + "," + v_green + "," + v_blue + "," + 1 + ")";
}    

function retDiv(p_char) {   // 네모난 div를 리턴해주는 함수
    var v_div = document.createElement("div");
    if(p_char) {
        v_div.setAttribute("class", "vNemo");
        v_div.style.backgroundColor = retColor();
        v_div.style.color = retColor();
        v_div.innerHTML = p_char;
    } else {
        v_div.setAttribute("class", "aNemo");
    }
    return v_div;
}

var request = {};
request.getParameter = function getParameter(p_name) {
    var v_jusoVal = location.href;
    if (v_jusoVal.indexOf("?") == -1) return null;  
    v_jusoVal = decodeURIComponent(v_jusoVal.split("?")[1]).split("&");
    for (var i = 0; i < v_jusoVal.length; i++) {
        if (v_jusoVal[i].split("=")[0] == p_name) {
            return v_jusoVal[i].split("=")[1];
        }
    }
}


// 네비게이션 하위메뉴 활성/비활성
var v_menuToggle = false;
function f_menu() {
    var v_subMenu = document.getElementById("id_ui");
    if (!v_menuToggle) {
        v_subMenu.style.display = "block";
        v_menuToggle = true;
    } else {
        v_subMenu.style.display = "none";
        v_menuToggle = false;
    }
}


