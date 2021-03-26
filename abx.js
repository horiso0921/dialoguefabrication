Array.prototype.shuffle = function() {
    var i = this.length;
    while (i) {
        var j = Math.floor(Math.random() * i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

// invalid enter key
function invalid_enter() {
    if (window.event.keyCode == 13) {
        return false;
    }
}

// start experiment
function start_experiment() {
    // get user name
    var name = document.getElementById("name").value.replace(" ", "_");
    if (name == "") {
        alert("名前を入力してください");
        return false;
    }

    // convert display
    Display()

    // read filepath
    var question_list = text_dir + "question.list";
    var category_list = text_dir + "category.list";
    // question = loadText(question_list);
    question = ["あなたは何歳ですか？",
            "あなたは今どこにいますか？",
            "今日は何月何日ですか？"
        ]
        // category = loadText(category_list);
    category = ["AV機器・カメラ", "SNS・コミュニケーションズ", "インターネット接続・インフラ"]
    console.log(question.length)
    outfile = name + ".csv";
    file_list = makeFileList()
    contents = (new Array(file_list.length)).fill("");
    eval = document.getElementsByName("eval");
    init()
}

// convert display
function Display() {
    document.getElementById("Display1").style.display = "none";
    document.getElementById("Display2").style.display = "block";
}

// load text file
function loadText(filename) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false);
    xhr.send(null);
    var list = xhr.responseText.split(/\r\n|\r|\n/);
    list.pop()

    return list;
}

// make file list
function makeFileList() {
    var files = Array(question.length);
    category.shuffle();
    question.shuffle();
    for (let i = 0; i < files.length; i++) {
        files[i] = [category[i], question[i]];
    }

    return files;
}

function setRequirements() {

    document.getElementById("page").textContent = "" + (n + 1) + "/" + 3;

    document.getElementById("category").innerHTML = "話題 : " + file_list[n][0];

    document.getElementById("question").innerHTML = "質問 : " + file_list[n][1];

}

function addmessage(this) {
    chkAddLimit(this).done(function(data) {
        var cnt = parseInt($('input[name="add_guest_cnt"]').val());
        if (data.res == '1') {
            var index = chkExis(data.cnt);
            $('#add_com_' + (index - 1)).after(getGuestForm(index));
            $('input[name="add_guest_cnt"]').val(cnt + 1);
        } else if (data.res == '0') {
            $(modal_add_guest_limit).addClass('modal-window-active');
        } else if (data.res == '2') {
            $(modal_people_restriction).addClass('modal-window-active');
        }
    }).fail(function(data) {
        $(modal_people_restriction).addClass('modal-window-active');
    });

    function init() {
        n = 0;
        setRequirements();
        contentCheck();
        setButton();
    }

    function contentCheck() {
        const c = contents[n];
        for (var i = 0; i < eval.length; i++) {
            eval[i].checked = false;
        }
    }

    function setButton() {
        if (n == (file_list.length - 1)) {
            document.getElementById("prev").disabled = false;
            document.getElementById("next2").disabled = true;
            document.getElementById("finish").disabled = true;
            for (var i = 0; i < eval.length; i++) {
                if (eval[i].checked) {
                    document.getElementById("finish").disabled = false;
                    break;
                }
            }
        } else {
            if (n == 0) {
                document.getElementById("prev").disabled = true;
            } else {
                document.getElementById("prev").disabled = false;
            }
            document.getElementById("next2").disabled = true;
            document.getElementById("finish").disabled = true;
            // for (var i = 0; i < eval.length; i++) {
            //     if (eval[i].checked) {
            //         document.getElementById("next2").disabled = false;
            //         break;
            //     }
            // }
        }
    }

    function evaluation() {
        for (var i = 0; i < eval.length; i++) {
            if (eval[i].checked) {
                scores[n] = i + 1;
            }
        }
        setButton();
    }

    function exportCSV() {
        var csvData = "";
        for (var i = 0; i < file_list.length; i++) {
            csvData += "" + file_list[i][1] + "," +
                file_list[i][2] + ",";
            for (let j = 0; j < contents[i].length; j++) {
                csvData += contents[i][j] + ",";
            }
            csvData += "\r\n";
        }

        const link = document.createElement("a");
        document.body.appendChild(link);
        link.style = "display:none";
        const blob = new Blob([csvData], { type: "octet/stream" });
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = outfile;
        link.click();
        window.URL.revokeObjectURL(url);
        link.parentNode.removeChild(link);
    }

    function next() {
        n++;
        setRequirements();
        contentCheck();
        setButton();
    }

    function prev() {
        n--;
        setRequirements();
        contentCheck();
        setButton();
    }

    function finish() {
        exportCSV();
    }

    // --------- 設定 --------- //

    // directory name
    const text_dir = "text/";

    // invalid enter key
    document.onkeypress = document.addEventListener('keydown', invalid_enter)

    var question;
    var category;
    var outfile;
    var file_list;
    var contents;
    var maxturn = 30;
    var minturn = 20;

    // ローカルで行う場合はloadText()は動作しないため
    var n = 0;
    var eval = document.getElementsByName("eval");

    function getValue() {
        var formObject = document.getElementById("Form");
        document.getElementById("outspeaker").innerHTML = formObject.formspeaker.value;
        document.getElementById("outmessage").innerHTML = " : " + formObject.formmessage.value;
    }

    window.onload = function() {
        getValue();
        var formObject = document.getElementById("Form");
        for (var i = 0; i < formObject.length; i++) {
            formObject.elements[i].onkeyup = function() {
                getValue();
            };
            formObject.elements[i].onchange = function() {
                getValue();
            };
        }
    }