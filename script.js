var SHIP_WIDTH;
var SHIP_HEIGHT;
var score = 0;
var hp = 100;
var tickID;
var speed_enemy = 1;
var SOUND_TRACK = new Audio("sound/soundtrack.mp3")

function setShip_proportions() {
    SHIP_HEIGHT = 80;
    SHIP_WIDTH = 80;
}

$(document).ready(function() {
    setShip_proportions();
    $(document).mousemove(move_ship);
    $("#button").bind("click",click_go);
});

function click_go() {
    $(document).bind("click",shot);
    score = 0;
    hp = 100;
    $("#start-game").hide("slow");
    tickID = setInterval(tick,1);
    SOUND_TRACK.play();
}

function move_ship(e) {
    if (e.pageX < $(document).width() - SHIP_WIDTH * 0.5 && e.pageX > SHIP_WIDTH / 2)
        $("#ship").css("left",e.pageX - SHIP_WIDTH / 2 + "px");
}

function shot() {
    var new_shot = document.createElement("div");
    spawnshot_X = parseInt($("#ship").css("left")) + SHIP_WIDTH / 2;
    spawnshot_Y = parseInt($("#ship").css("bottom")) + 80;
    $(new_shot).addClass("shot");
    $(new_shot).css({
        left: spawnshot_X,
        bottom: spawnshot_Y
    });
    $("body").append(new_shot);
}

function tick() {
    var shots = $(".shot");
    for (i = 0; i < shots.length; i++) {
        currentY = parseInt($(shots[i]).css("bottom"));
        if (currentY > $(window).height()) {
            $(shots[i]).remove();
            continue;
        }
        if (!chackfor_collision(shots[i]))
            $(shots[i]).css("bottom",currentY + 3);
    }
    
    
    var enemys = $(".enemy");
    for (i = 0; i < enemys.length; i++) {
        currentY = parseInt($(enemys[i]).css("top"));
        if (currentY > $(window).height() - 80) {
            $(enemys[i]).remove();
            hp -= 5;
            if (hp < 0) {
                game_over();
                return;
            }
            draw_hp();
            continue;
        }
        $(enemys[i]).css("top",currentY + speed_enemy);
    }
    
    if (enemys.length == 0)
        create_enemy();
    
    speed_enemy = 1 + score / 300;
}

function chackfor_collision(shot) {
    var enemys = $(shot).collision('.enemy');
    if (enemys.length > 0) {
        $(enemys[0]).remove();
        $(shot).remove();
        score += 3;
        draw_score();
        return true;
    } else 
        return false;
}

function create_enemy() {
    var start_point =  randomInteger($(window).width() - 80,50);
    var new_enemy = document.createElement("div");
    $(new_enemy).addClass("enemy");
    var image = "url(image/RD" + String(randomInteger(1,4)) + ".png)";
    $(new_enemy).css({
        left: start_point,
        top: 0,
        backgroundImage: image
    });
    $("body").append(new_enemy);
    
    if ($(".enemy").length < 2) {
        if (randomInteger(0,1) == 1)
            setTimeout(create_enemy,2000)
    }
}

function draw_score() {
    $("#score-count").html(score);
}

function draw_hp() {
    $("#hp").val(hp);
}

function randomInteger(min, max) {
    var rand = min + Math.random() * (max - min)
    rand = Math.round(rand);
    return rand;
}

function game_over() {
    $(document).unbind("click",shot);
    $("#head").html("Game Over");
    $("#display-score").html("You score: " + score);
    $("#display-score").css("display","block");
    clearInterval(tickID);
    $("#start-game").show("slow");
}

