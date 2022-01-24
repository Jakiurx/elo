let pola_biale = [0,2,4,6,9,11,13,15,16,18,20,22,25,27,29,31,32,34,36,38,41,43,45,47,48,50,52,54,57,59,61,63]
// let pola_brazowe = [1,3,5,7,8,10,12,14,17,19,21,23,24,26,28,30,33,35,37,39,40,42,44,46,49,51,53,55,56,58,60,62]

let pionki = [12,12]
let damki = [0,0]

let tura = true;

let strona, ally_color, enemy_color, ruszany_pionek, copy_of_tura, map;

function randomNumber(number) { 
    return Math.floor(Math.random() * number);
}



function ustaw_pionki(kolor_a, kolor_b){

    for(let i = 0; i < 23; i++) {
        if(pola_biale.includes(i)){
            let x = Math.floor(i/8);
            let y = i%8;
            map[x][y] = kolor_a;
        }
    }

    for(let i = 63; i > 39; i--){
        if(pola_biale.includes(i)){
            let x = Math.floor(i/8);
            let y = i%8;
            map[x][y] = kolor_b;
        }
    }

}

function wczytaj_plansze(){
    for(i of pola_biale){
        document.getElementById("cell" + i).innerHTML = "";
        let x = Math.floor(i/8);
        let y = i%8;

        let pionek = document.createElement("div");
        if(map[x][y] == 1) {
            pionek.className = "pionek_1";
            document.getElementById("cell" + i).appendChild(pionek);
        }
        else if(map[x][y] == 2){
            pionek.className = "pionek_2";
            document.getElementById("cell" + i).appendChild(pionek);
        }
        else if(map[x][y] == 11){
            pionek.className = "pionek_11";
            document.getElementById("cell" + i).appendChild(pionek);
        }
        else if(map[x][y] == 22){
            pionek.className = "pionek_22";
            document.getElementById("cell" + i).appendChild(pionek);
        }
    }
}


function start(){
    wyczysc_kolory();
    map = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    if(randomNumber(2) == 1) {
        ustaw_pionki(2,1);
        strona = true;
}
    else {
        ustaw_pionki(1,2);
        strona = false;
    }
    wczytaj_plansze();
}

function ruch(x,y){
    let pole = x*8 + y;

    if(document.getElementById("cell" + pole).style.backgroundColor == "yellow"){
        map[ruszany_pionek[0]][ruszany_pionek[1]] = 0;
        map[x][y] = ruszany_pionek[2];
        //zwykly ruch
        //sprawdz czy jakis pionek mial bicie
        tura = !tura;
        strona = !strona;
        if(x == 0 || x == 7) zmien_na_damke(x,y);
        wyczysc_kolory();
    }
    else if(document.getElementById("cell" + pole).style.backgroundColor == "red"){
        let elox = x - Math.sign(x-ruszany_pionek[0]);
        let eloy = y - Math.sign(y-ruszany_pionek[1]);
        console.log(elox,eloy)
        map[ruszany_pionek[0]][ruszany_pionek[1]] = 0;
        map[elox][eloy] = 0;
        map[x][y] = ruszany_pionek[2];

        if(ruszany_pionek[2] == 1) pionki[1]--;
        if(ruszany_pionek[2] == 2) pionki[0]--;

        wyczysc_kolory();
        wczytaj_plansze();
        ruszany_pionek = [x,y,ruszany_pionek[2]];
        sprawdz_bicia(x,y,pole);
        if(tura != 3){
            copy_of_tura = tura;
        }

        if(jesli_bicie()){
            tura = 3;
        }
        if(!jesli_bicie()){
            tura = copy_of_tura;
            tura = !tura;
            strona = !strona;
        }
        if(x == 0 || x == 7) zmien_na_damke(x,y);
    }

    else if(tura == true){ 
        if(map[x][y] == 1) {
            wyczysc_kolory();
            document.getElementById("cell" + pole).style.backgroundColor = "gray";
            ruszany_pionek = [x,y,1];
            enemy_color = 2;
            sprawdz_ruch(x,y,pole);
            sprawdz_bicia(x,y,pole);
        }
        if(map[x][y] == 11 && pionki[0] > 4) {
            wyczysc_kolory();
            document.getElementById("cell" + pole).style.backgroundColor = "green";
            ruszany_pionek = [x,y,11];
            enemy_color = 2;
            sprawdz_ruchy_damka(x,y);
        }
    }

    else if(tura == false){
        if(map[x][y] == 2) {
            wyczysc_kolory();
            document.getElementById("cell" + pole).style.backgroundColor = "gray";
            ruszany_pionek = [x,y,2];
            enemy_color = 1;
            sprawdz_ruch(x,y,pole);
            sprawdz_bicia(x,y,pole);
        }
        if(map[x][y] == 22 && pionki[1] > 4) {
            wyczysc_kolory();
            document.getElementById("cell" + pole).style.backgroundColor = "blue";
            ruszany_pionek = [x,y,22];
            enemy_color = 1;
            sprawdz_ruchy_damka(x,y);
        }
    }
    wczytaj_plansze();
    sprawdz_wygrana();
}

function sprawdz_ruch(x,y,pole){
    let pole_temp;
    if(x > 0 && strona){
        if(y > 0){
            pole_temp = pole - 9;
            if(map[x-1][y-1] == 0) document.getElementById("cell" + pole_temp).style.backgroundColor = "yellow";
        }

        if(y < 7){
            pole_temp = pole - 7;
            if(map[x-1][y+1] == 0) document.getElementById("cell" + pole_temp).style.backgroundColor = "yellow";  
        }
    }


    if(x < 7 && !strona){
        if(y > 0){
            pole_temp = pole + 7;
            if(map[x+1][y-1] == 0) document.getElementById("cell" + pole_temp).style.backgroundColor = "yellow";
        }

        if(y < 7){
            pole_temp = pole + 9;
            if(map[x+1][y+1] == 0) document.getElementById("cell" + pole_temp).style.backgroundColor = "yellow";
        }
    }
}

function sprawdz_bicia(x,y,pole){
    
    if(x > 1){
        if(y > 1){
            pole_temp = pole - 18;
            if(map[x-1][y-1] == enemy_color || map[x-1][y-1] == enemy_color*10 + enemy_color){
                if(map[x-2][y-2] == 0) document.getElementById("cell" + pole_temp).style.backgroundColor = "red"; 
            }
        }

        if(y < 6){
            
            pole_temp = pole - 14;
            if(map[x-1][y+1] == enemy_color || map[x-1][y+1] == enemy_color*10 + enemy_color){
                if(map[x-2][y+2] == 0) document.getElementById("cell" + pole_temp).style.backgroundColor = "red";
            }
        }
    }

    if(x < 6){
        if(y < 6){
            pole_temp = pole + 18;
            if(map[x+1][y+1] == enemy_color || map[x+1][y+1] == enemy_color*10 + enemy_color){
                if(map[x+2][y+2] == 0){
                    document.getElementById("cell" + pole_temp).style.backgroundColor = "red";
                }    
            }
        }

        if(y > 1){
            pole_temp = pole + 14;
            if(map[x+1][y-1] == enemy_color || map[x+1][y-1] == enemy_color*10 + enemy_color){
                if(map[x+2][y-2] == 0){
                    document.getElementById("cell" + pole_temp).style.backgroundColor = "red";
                }    
            }
        }
    }
}

function jesli_bicie(){
    for(x of pola_biale) {
        if(document.getElementById("cell" + x).style.backgroundColor == "red"){
            return true;
        }
    }
    return false;
}


function wyczysc_kolory(){
    for(x of pola_biale) {
        document.getElementById("cell" + x).style.backgroundColor = "#f1decc";
    }
    //for(x of pola_brazowe) {
    //    document.getElementById("cell" + x).style.backgroundColor = "#423529";
    //}
}

function sprawdz_wygrana() {
    if(pionki[0] == 0 && damki[0] > 2) alert("Czarne wygrały");
    if(pionki[1] == 0 && damki[1] > 2) alert("Białe wygrały");
}


function sprawdz_ruchy_damka(x,y) {
    for(g = 0; g < 8; g++){
        temp_x = x + g;
        temp_y = y + g;
        if(rysuj_ruch_damka(temp_x,temp_y)) break;
    }
    for(g = 0; g < 8; g++){
        temp_x = x + g;
        temp_y = y - g;
        if(rysuj_ruch_damka(temp_x,temp_y)) break;
        
    }
    for(g = 0; g < 8; g++){
        temp_x = x - g;
        temp_y = y + g;
        if(rysuj_ruch_damka(temp_x,temp_y)) break;
    }
    for(g = 0; g < 8; g++){
        temp_x = x - g;
        temp_y = y - g;
        if(rysuj_ruch_damka(temp_x,temp_y)) break;

    }

}


function rysuj_ruch_damka(temp_x,temp_y){
    if(temp_x < 0 || temp_x > 7 || temp_y < 0 || temp_y > 7) return true;
    pole_temp = temp_x*8 + temp_y;
    if (map[temp_x][temp_y] == 0){
        document.getElementById("cell" + pole_temp).style.backgroundColor = "yellow";
    }
    if (map[temp_x][temp_y] == enemy_color || map[temp_x][temp_y] == enemy_color*10 + enemy_color) {
        sprawdz_bicie_damka(temp_x,temp_y);
        return true;
    }
    else return;
}

function sprawdz_bicie_damka(a,b){
    a = a + Math.sign(a-ruszany_pionek[0]) 
    b = b + Math.sign(b-ruszany_pionek[1]) 
    if(a < 0 || a > 7 || b < 0 || b > 7) return;
    console.log(a,b)
    pole_temp = a*8 + b;
    console.log(pole_temp)
        if (map[a][b] == 0) document.getElementById("cell" + pole_temp).style.backgroundColor = "red";
}

function zmien_na_damke(x,y){
    if (ruszany_pionek[2]==1) {
        map[x][y] = 11;
        pionki[0]--;
        damki[0]++;
    }
    if (ruszany_pionek[2] == 2) {
        map[x][y] = 22;
        pionki[1]--;
        damki[1]++;
    }
}