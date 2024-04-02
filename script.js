const playerHPUpgrade = 15;
const playerADUpgrade = 6;
var playerAPUpgrade = 3;
const playerArmourUpgrade = 20;
const playerPenUpgrade = 14;
const playerCleaveUpgrade = 9;
const playerCritChanceUpgrade = 10;
const playerCritDMGUpgrade = 10;

const myIPAdress = '31.45.198.165';

let score = 0;
let TotalDamageDone = 0;
let TotalDmgMitigated = 0;
let TotalDamageTaken = 0;
let TotalADDamage = 0;
let TotalAPDamage = 0;

class Pawn {
    constructor(HP, AD, Armour, AP, Pen, Cleave, CritChance, CritDamage) {
        this.HP = HP;
        this.AD = AD;
        this.Armour = Armour;
        this.AP = AP;
        this.Pen = Pen;
        this.Cleave = Cleave;
        this.CritChance = CritChance;
        this.CritDamage = CritDamage;
        this.MAXHP = HP;
        this.EXP = 0;
        this.LVL = 1;
        this.REXP = 10;
    }
}

//READING THE URL VALUES
const urlParams = new URLSearchParams(window.location.search);
const pickedClass = urlParams.get('class');
const pickedDifficulty = urlParams.get('difficulty');
console.log(pickedClass);

switch (pickedClass) {
    case 'tank':
        var player = new Pawn(80, 1, 30, 1, 2, 2, 5, 5);
        break;
    case 'mage':
        var player = new Pawn(30, 1, 1, 5, 1, 1, 20, 40);
        break;
    case 'assassin':
        var player = new Pawn(30, 12, 4, 1, 25, 30, 15, 20);
        break;
    case 'hunter':
        var player = new Pawn(30, 15, 1, 1, 4, 5, 30, 50);
        break;
    case 'sacred-blade':
        var player = new Pawn(30, 15, 1, 1, 1, 5, 15, 30);
        break;
    case 'thorned':
        var player = new Pawn(80, 1, 40, 1, 1, 5, 15, 10)
        break;
    case 'holy-moly':
        var player = new Pawn(50, 5, 20, 15, 1, 5, 20, 20);
        break;
    case 'boxer':
        var player = new Pawn(80, 10, 30, 1, 0, 0, 35, 30);
        break;
    default:
        var player = new Pawn(20, 5, 15, 4, 5, 5, 10, 15);
}
var enemy = new Pawn(10, 1, 0, 0, 0, 0,);

const uiPlayerHealth = document.getElementById("uiPlayerHealth");
const uiPlayerAD = document.getElementById("uiPlayerAD");
const uiPlayerAP = document.getElementById("uiPlayerAP");
const uiPlayerArmour = document.getElementById("uiPlayerArmour");
const uiPlayerPen = document.getElementById("uiPlayerPen");
const uiPlayerCleave = document.getElementById("uiPlayerCleave");
const uiPlayerCritChance = document.getElementById("uiPlayerCritChance");
const uiPlayerCritDamage = document.getElementById("uiPlayerCritDamage");
const uiPlayerLevel = document.getElementById("uiPlayerLevel");
const uiPlayerEXP = document.getElementById("uiPlayerEXP");
const uiPlayerREXP = document.getElementById("uiPlayerREXP");

const uiEnemyHealth = document.getElementById("uiEnemyHealth");
const uiEnemyAD = document.getElementById("uiEnemyAD");
const uiEnemyAP = document.getElementById("uiEnemyAP");
const uiEnemyArmour = document.getElementById("uiEnemyArmour");
const uiEnemyPen = document.getElementById("uiEnemyPen");
const uiEnemyCleave = document.getElementById("uiEnemyCleave");

const imagePaths = ["./media/enemy animations/1-default.png", "./media/enemy animations/1-hurt.png", "./media/enemy animations/1-death1.png", "./media/enemy animations/1-death2.png", "./media/enemy animations/1-death3.png", "./media/enemy animations/1-death4.png", "./media/enemy animations/1-death5.png", "./media/enemy animations/1-death6.png"];
const imagePaths2 = ["./media/enemy animations/2-default.png", "./media/enemy animations/2-hurt.png", "./media/enemy animations/2-death1.png", "./media/enemy animations/2-death2.png", "./media/enemy animations/2-death3.png", "./media/enemy animations/2-death4.png", "./media/enemy animations/2-death5.png"];
const imagePaths1overkill = ["./media/enemy animations/1-overkill1.png", "./media/enemy animations/1-overkill2.png", "./media/enemy animations/1-overkill3.png", "./media/enemy animations/1-overkill4.png", "./media/enemy animations/1-overkill5.png", "./media/enemy animations/1-overkill6.png"];
const imagePaths2overkill = ["./media/enemy animations/2-overkill1.png", "./media/enemy animations/2-overkill2.png", "./media/enemy animations/2-overkill3.png", "./media/enemy animations/2-overkill4.png", "./media/enemy animations/2-overkill5.png", "./media/enemy animations/2-overkill6.png", "./media/enemy animations/2-overkill7.png"];
var image;

//HOTKEYS
let allowAttack = 1;
document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyA' && allowAttack) {
        attack();
    }
});


//IMAGE PRELOADING FOR SMOOTH ANIMATIONS
function loadImages(imageArrays) {
    return Promise.all(imageArrays.map(imageArray =>
        Promise.all(imageArray.map((imagePath) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load image ${imagePath}`));
                img.src = imagePath;
            });
        }))
    ));
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function playAnimation(val) {
    loadImages([imagePaths, imagePaths2, imagePaths1overkill, imagePaths2overkill]).then((imageArrays) => {
        // code to use loaded images
        switch (val) {
            case 1: //hurt
                document.getElementById("uiEnemyAnimation").src = imagePaths[1];
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths[0];
                }, 300);
                break;
            case 2: //killed
                document.getElementById("uiEnemyAnimation").src = imagePaths[2];
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths[3];
                }, 100);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths[4];
                }, 200);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths[5];
                }, 300);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths[6];
                }, 400);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths[7];
                }, 500);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths[0];
                }, 1000);
                break;
            case 3: //overkilled
                document.getElementById("uiEnemyAnimation").src = imagePaths1overkill[0];
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths1overkill[1];
                }, 100);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths1overkill[2];
                }, 200);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths1overkill[3];
                }, 300);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths1overkill[4];
                }, 400);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths1overkill[5];
                }, 500);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths[0];
                }, 1000);
                break;
            case 4: //imp animation hurt
                document.getElementById("uiEnemyAnimation").src = imagePaths2[1];
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2[0];
                }, 300);
                break;
            case 5: //imp animation death
                document.getElementById("uiEnemyAnimation").src = imagePaths2[2];
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2[3];
                }, 100);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2[4];
                }, 200);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2[5];
                }, 300);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2[6];
                }, 400);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2[0];
                }, 1000);
                break;
            case 6: //imp animation overkill
                document.getElementById("uiEnemyAnimation").src = imagePaths2overkill[0];
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2overkill[1];
                }, 100);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2overkill[2];
                }, 200);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2overkill[3];
                }, 300);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2overkill[4];
                }, 400);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2overkill[5];
                }, 500);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2overkill[6];
                }, 600);
                setTimeout(() => {
                    document.getElementById("uiEnemyAnimation").src = imagePaths2[0];
                }, 1000);
                break;
        }
    }).catch((error) => {
        console.error(error);
    });
    return;
}

function startGame() {
    uiPlayerHealth.innerHTML = player.HP;
    uiPlayerAD.innerHTML = player.AD;
    uiPlayerAP.innerHTML = player.AP;
    uiPlayerArmour.innerHTML = player.Armour;
    uiPlayerPen.innerHTML = player.Pen;
    uiPlayerCleave.innerHTML = player.Cleave;
    uiPlayerCritChance.innerHTML = player.CritChance;
    uiPlayerCritDamage.innerHTML = player.CritDamage;
    uiPlayerLevel.innerHTML = player.LVL;
    uiPlayerEXP.innerHTML = player.EXP;
    uiPlayerREXP.innerHTML = player.REXP;
    uiEnemyHealth.innerHTML = enemy.HP;
    uiEnemyAD.innerHTML = enemy.AD;
    uiEnemyAP.innerHTML = enemy.AP;
    uiEnemyArmour.innerHTML = enemy.Armour;
    uiEnemyPen.innerHTML = enemy.Pen;
    uiEnemyCleave.innerHTML = enemy.Cleave;
};

let audioGameOver = new Audio('./media/DoomVictor.mp3');
const form = document.querySelector('#score-form');
const submitButton = document.getElementById("submit-score-button");
function disableSubmitButton() {
    const submitButton = document.getElementById("submit-score-button");
    submitButton.style.pointerEvents = "none";
    submitButton.style.opacity = 0.5;
    submitButton.style.color = "";
    submitButton.style.borderColor = "";
}
form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const name = document.querySelector('#name').value;
    const password = document.querySelector('#password').value;
    const maxhp = player.MAXHP;
    const AD = player.AD;
    const AP = player.AP;
    const Armour = player.Armour;
    const Pen = player.Pen;
    const Cleave = player.Cleave;
    const CritP = player.CritChance;
    const CritDMG = player.CritDamage;
    const Level = player.LVL;
    const DMGdone = Math.round(TotalDamageDone);
    const DMGmitigated = Math.round(TotalDmgMitigated);
    const DMGtaken = Math.round(TotalDamageTaken);
    const PhysDMG = Math.round(TotalADDamage);
    const APDMG = Math.round(TotalAPDamage);
    const score = Number((document.getElementById("uiPlayerScore").textContent).replace(/^\D+/g, ''));
    if (score === 0) {
        disableSubmitButton();
        submitButton.style.color = "red";
        submitButton.style.borderColor = "red";
        const node = document.createElement('p');
        node.innerHTML = '<p style="color:red;">You have 0 score!</p>';
        submitButton.appendChild(node);
        return;
    }

    let response;
    try {
        response = await fetch(`http://${myIPAdress}:3000/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, password, maxhp, AD, AP, Armour, Pen, Cleave, CritP, CritDMG, Level, DMGdone, DMGmitigated, DMGtaken, PhysDMG, APDMG, score })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
        }

        const result = await response.text();
        console.log(result);
        disableSubmitButton();
        submitButton.style.color = "green";
        updateScoreboard();
    } catch (e) {
        console.error(e);
        console.log('Failed to submit score to first address, trying second address...');
        try {
            response = await fetch('http://192.168.8.34:3000/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, password, maxhp, AD, AP, Armour, Pen, Cleave, CritP, CritDMG, Level, DMGdone, DMGmitigated, DMGtaken, PhysDMG, APDMG, score })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
            }

            const result = await response.text();
            console.log(result);
            disableSubmitButton();
            submitButton.style.color = "green";
            updateScoreboard();
        } catch (e) {
            console.error(e);
            if (e.response && e.response.status === 401) {
                const errorNode = document.createElement('p');
                errorNode.style.color = 'red';
                errorNode.textContent = 'Wrong password!';
                form.appendChild(errorNode);
            } else {
                console.log('Failed to submit score to second address as well.');
                submitButton.style.color = "red";
                submitButton.style.borderColor = "red";
                const node = document.createElement('p');
                node.innerHTML = '<p style="color:red;">Failed to submit score! (Incorrect Password)</p>';
                form.appendChild(node);
            }
            return;
        }
    }
});



async function updateScoreboard() {
    const addresses = ['http://' + myIPAdress + ':3000/scores', 'http://192.168.8.34:3000/scores'];

    let scoreboardData = null;

    for (const address of addresses) {
        try {
            const response = await fetch(address);
            scoreboardData = await response.json();
            break;
        } catch (error) {
            console.error(`Failed to fetch data from ${address}`, error);
        }
    }

    if (!scoreboardData) {
        console.error('Failed to fetch scoreboard data from all addresses');
        return;
    }

    const tbody = document.querySelector('#score-table tbody');
    const rows = tbody.querySelectorAll('tr');
    if (rows.length > 1) {
        for (let i = 1; i < rows.length; i++) {
            tbody.removeChild(rows[i]);
        }
    }
    for (let i = 0; i < scoreboardData.length; i++) {
        const row = document.createElement('tr');
        const numCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const scoreCell = document.createElement('td');
        const maxhpCell = document.createElement('td');
        const adCell = document.createElement('td');
        const apCell = document.createElement('td');
        const armourCell = document.createElement('td');
        const penCell = document.createElement('td');
        const cleaveCell = document.createElement('td');
        const critpCell = document.createElement('td');
        const critdmgCell = document.createElement('td');
        const levelCell = document.createElement('td');
        const dmgdoneCell = document.createElement('td');
        const dmgmitigatedCell = document.createElement('td');
        const dmgtakenCell = document.createElement('td');
        const physdmgCell = document.createElement('td');
        const apdmgCell = document.createElement('td');

        numCell.textContent = i + 1 + '.';
        nameCell.textContent = scoreboardData[i].name;
        scoreCell.textContent = scoreboardData[i].score;
        maxhpCell.textContent = scoreboardData[i].maxhp;
        adCell.textContent = scoreboardData[i].AD;
        apCell.textContent = scoreboardData[i].AP;
        armourCell.textContent = scoreboardData[i].Armour;
        penCell.textContent = scoreboardData[i].Pen;
        cleaveCell.textContent = scoreboardData[i].Cleave;
        critpCell.textContent = scoreboardData[i].CritP;
        critdmgCell.textContent = scoreboardData[i].CritDMG;
        levelCell.textContent = scoreboardData[i].Level;
        dmgdoneCell.textContent = scoreboardData[i].DMGdone;
        dmgmitigatedCell.textContent = scoreboardData[i].DMGmitigated;
        dmgtakenCell.textContent = scoreboardData[i].DMGtaken;
        physdmgCell.textContent = scoreboardData[i].PhysDMG;
        apdmgCell.textContent = scoreboardData[i].APDMG;

        row.appendChild(numCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        row.appendChild(maxhpCell);
        row.appendChild(adCell);
        row.appendChild(apCell);
        row.appendChild(armourCell);
        row.appendChild(penCell);
        row.appendChild(cleaveCell);
        row.appendChild(critpCell);
        row.appendChild(critdmgCell);
        row.appendChild(levelCell);
        row.appendChild(dmgdoneCell);
        row.appendChild(dmgmitigatedCell);
        row.appendChild(dmgtakenCell);
        row.appendChild(physdmgCell);
        row.appendChild(apdmgCell);

        tbody.appendChild(row);
    }
};


function gameOver() {
    allowAttack = 0;
    document.getElementById("inGame").style.display = "none";
    document.getElementById("postGame").style.display = "inline-block";
    document.getElementById("leaderboard-button").style.display = "none";
    audioGameOver.play();
    updateScoreboard();
    return;
};

const progressBarFill = document.querySelector('.progress-bar-fill');
const maxelapsed = 5; // duration of timer in seconds
let elapsed = -5; // elapsed time in seconds
let attackingRN = 0;
let timer = null;
function attack() {
    if (pickedDifficulty == 'ez') {
        hit(1);
        return;
    }
    if (!attackingRN) {
        attackingRN = 1;
        elapsed = -5;
        timer = setInterval(() => {
            elapsed += 0.8;
            let percent = ((elapsed + 5) / (maxelapsed + 5)) * 100;
            progressBarFill.style.width = percent + '%';
            if (elapsed >= maxelapsed) {
                clearInterval(timer);
                progressBarFill.style.width = '0%';
                hit(0);
                attackingRN = 0;
            }
        }, 40);
    } else {
        clearInterval(timer);
        progressBarFill.style.width = '0%';
        attackingRN = 0;
        if (pickedClass == 'hunter') {
            console.log(2 - ((Math.abs(elapsed) * 2) / 5));
            hit(2 - ((Math.abs(elapsed) * 2) / 5));
        }
        else if (pickedDifficulty == 'normal') {
            console.log((-0.04 * Math.pow(elapsed, 2)) + 1);
            hit((-0.04 * Math.pow(elapsed, 2)) + 1);
        }
        else if (pickedDifficulty == 'hard') {
            console.log(1 - (Math.abs(elapsed) / 5));
            hit(1 - (Math.abs(elapsed) / 5));
        }
    }
}
let audioPunch = new Audio('./media/punch1.mp3')
let audioCrit = new Audio('./media/crit.mp3')
let attackValue = 0;
let chainAttack = 0;
let dmgFactor = 0.5;
var passiveAbsorb = 0;
function hit(val) {
    dmgFactor = 0.5;
    dmgFactor += val / 2;
    chainAttack++;
    if (pickedClass == 'boxer') chainAttack++;
    attackValue = 0;
    if (pickedClass == 'mage') {
        attackValue += player.AD * (1 - (((enemy.Armour * (1 - player.Cleave / 100)) - (player.Pen + player.AP)) / 100)) + player.AP;
    } else if (pickedClass == 'assassin') {
        attackValue += player.AD * (1 - (((enemy.Armour * (1 - player.Cleave / 100)) - (player.Pen + (player.AD * 0.25))) / 100)) + player.AP;
    } else if (pickedClass == 'sacred-blade') {
        attackValue += player.AD * (1 - (((enemy.Armour * (1 - player.Cleave / 100)) - player.Pen) / 100)) + player.AP + player.AD * 0.3;
    } else if (pickedClass == 'boxer') {
        attackValue += player.AD * (1.2 - (((enemy.Armour * (1 - player.Cleave / 100)) - player.Pen) / 100)) + player.AP;
    } else attackValue += player.AD * (1 - (((enemy.Armour * (1 - player.Cleave / 100)) - player.Pen) / 100)) + player.AP;
    attackValue *= dmgFactor;
    TotalADDamage += attackValue - player.AP;
    TotalAPDamage += player.AP;
    if (pickedClass == 'sacred-blade') {
        TotalAPDamage += player.AD * 0.3;
        TotalADDamage -= player.AD * 0.3;
    }
    if (pickedClass == 'thorned') {
        attackValue += ((player.Armour / 4) / 100) * enemy.AD;
        TotalAPDamage += ((player.Armour / 4) / 100) * enemy.AD;
    }
    attackValue += attackValue * (chainAttack / 10);
    document.getElementById("uiDamageDone").innerHTML = Math.round(attackValue * 100) / 100 + ' Damage Done';
    if (Math.random() * 100 < player.CritChance) {
        attackValue += player.AD * (player.CritDamage / 100);
        if (pickedClass == 'thorned') attackValue += ((player.Armour / 4) / 100) * enemy.AD;
        player.EXP += Math.round(player.AD * (player.CritDamage / 100));
        uiPlayerEXP.innerHTML = player.EXP;
        document.getElementById("uiDamageDone").innerHTML += ' ' + Math.round(player.AD * (player.CritDamage / 100) * 100) / 100 + ' Crit DMG';
        audioCrit.play();
    } else audioPunch.play();
    enemy.HP -= attackValue;
    TotalDamageDone += attackValue;
    enemy.HP = Math.round(enemy.HP * 100) / 100;
    if (enemy.HP <= 0) {
        chainAttack = 0;
        if (enemy.HP < -enemy.MAXHP) killed(1);
        else killed(0);
        return;
    }
    if (pickedClass == 'tank') passiveAbsorb++;
    if (pickedClass == 'holy-moly') {
        attackValue = enemy.AD * (1 - (((player.Armour * (1 - enemy.Cleave / 100)) - enemy.Pen) / 100)) + enemy.AP * (1 - ((player.Armour/2)/100));
        TotalDmgMitigated += enemy.AP * ((player.Armour/2)/100);
    } else attackValue = enemy.AD * (1 - (((player.Armour * (1 - enemy.Cleave / 100)) - enemy.Pen) / 100)) + enemy.AP;
    TotalDmgMitigated += enemy.AD - attackValue;
    if (passiveAbsorb != 3) {
        player.HP -= attackValue;
        TotalDamageTaken += attackValue;
        player.HP = Math.round(player.HP * 100) / 100;
        document.getElementById("uiDamageTaken").innerHTML = Math.round(attackValue * 100) / 100 + ' Damage Taken';
    }
    else if (passiveAbsorb >= 3) {
        passiveAbsorb = 0;
        document.getElementById("uiDamageTaken").innerHTML = 'Absorbed';
    }
    console.log('Absorb passive = ' + passiveAbsorb);
    if (player.HP <= 0) gameOver();
    uiPlayerHealth.innerHTML =  player.HP;
    uiEnemyHealth.innerHTML =  enemy.HP;
    switch (true) {
        case graveCounter <= 30:
            playAnimation(1);
            break;
        case graveCounter <= 60:
            playAnimation(4);
            break;
        default:
            playAnimation(4);
            break;
    }
};

let audioDeath1_1 = new Audio('./media/enemy sounds/death1-1.mp3')
let audioDeath1_2 = new Audio('./media/enemy sounds/death1-2.mp3')
let audioDeath1_3 = new Audio('./media/enemy sounds/death1-3.mp3')
let audioDeath2_1 = new Audio('./media/enemy sounds/death2-1.wav')
let audioDeath2_2 = new Audio('./media/enemy sounds/death2-2.wav')
let audioDeath2_3 = new Audio('./media/enemy sounds/death2-3.wav')
let audioOverkill = new Audio('./media/enemy sounds/overkill1.wav')
function playDeathAudio(level, overkill) {
    if (overkill) {
        switch (level) {
            case 1:
                playAnimation(3);
                break;
            case 2:
                playAnimation(6);
                break;
        }
        audioOverkill.play();
        return;
    } else
        switch (level) {
            case 1:
                playAnimation(2);
                break;
            case 2:
                playAnimation(5);
                break;
        }
    var val = Math.round(Math.random() * 3);
    switch (level) {
        case 1:
            switch (val) {
                case 1:
                    audioDeath1_1.play();
                    break;
                case 2:
                    audioDeath1_2.play();
                    break;
                case 3:
                    audioDeath1_3.play();
                    break;
            }
            break;
        case 2:
            switch (val) {
                case 1:
                    audioDeath2_1.play();
                    break;
                case 2:
                    audioDeath2_2.play();
                    break;
                case 3:
                    audioDeath2_3.play();
                    break;
            }
            break;
    }
}

function getRandomArbitraryFloored(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let enemyExp = 1;
function generateNewEnemy() {
    enemyExp += Math.log(1.4 * enemyExp + 1.1) / Math.log(50);
    console.log("enemyEXP = " + enemyExp);
    let enemyHP = getRandomArbitraryFloored(enemyExp * 8, enemyExp * 10);
    let enemyAD = getRandomArbitraryFloored(enemyExp * 1, (enemyExp * 3 * (1 - (enemyHP / (enemyExp * 10)))) + 1);
    let enemyArmour = getRandomArbitraryFloored(enemyExp * 0, (enemyExp * 3 * (1 - (enemyAD / (enemyExp * 10)))) + 1);
    let enemyAP = getRandomArbitraryFloored(enemyExp * 0, (enemyExp * 1 * (1 - (enemyArmour / (enemyExp * 10)))) + 1);
    let enemyPen = getRandomArbitraryFloored(enemyExp * 0, (enemyExp * 2 * (1 - (enemyAP / (enemyExp * 10)))) + 1);
    let enemyCleave = getRandomArbitraryFloored(0, (enemyExp * 2 * (1 - (enemyPen / (enemyExp * 10)))) + 1);
    enemy = new Pawn(enemyHP, enemyAD, enemyArmour, enemyAP, enemyPen, enemyCleave);
}

let graveCounter = 0;
function killed(overkill) {
    switch (pickedDifficulty) {
        case 'ez':
            score += Math.round(0.8 * (enemy.MAXHP + enemy.AD * 3 + enemy.AP * 4 + enemy.Armour * 2 + enemy.Cleave * 2 + enemy.Pen * 3));
            break;
        case 'normal':
            score += enemy.MAXHP + enemy.AD * 3 + enemy.AP * 4 + enemy.Armour * 2 + enemy.Cleave * 2 + enemy.Pen * 3;
            break;
        case 'hard':
            score += Math.round(1.2 * (enemy.MAXHP + enemy.AD * 3 + enemy.AP * 4 + enemy.Armour * 2 + enemy.Cleave * 2 + enemy.Pen * 3));
            break;
    }
    document.getElementById("uiPlayerScore").innerHTML = "Score = " + score;
    player.HP = player.MAXHP;
    player.EXP += enemy.MAXHP + enemy.AD * 3 + enemy.AP * 4 + enemy.Armour * 2 + enemy.Cleave * 2 + enemy.Pen * 3;
    generateNewEnemy();
    startGame();
    uiPlayerEXP.innerHTML = player.EXP;
    uiPlayerHealth.innerHTML = player.HP;
    uiEnemyHealth.innerHTML = enemy.HP;
    if (player.EXP >= player.REXP) levelup();
    player.HP = player.MAXHP;
    graveCounter++;
    if (overkill) {
        player.EXP += Math.floor(Math.pow(1.9, enemyExp));
        document.getElementById("grave-place").innerHTML += "<img src='./media/overkill.png' width='30' height=auto>";
    }
    if (graveCounter <= 30) {
        if (!overkill) document.getElementById("grave-place").innerHTML += "<img src='./media/skull-drawing.png' width='30' height=auto>";
        playDeathAudio(1, overkill);
    }
    if (graveCounter > 30 && graveCounter <= 60) {
        if (!overkill) document.getElementById("grave-place").innerHTML += "<img src='./media/skull2.png' width='40' height=auto>";
        playDeathAudio(2, overkill);
    }
    if (graveCounter > 60 && graveCounter <= 100) {
        if (!overkill) document.getElementById("grave-place").innerHTML += "<img src='./media/skull3.png' width='50' height=auto>";
    }
    if (graveCounter > 100 && graveCounter <= 150) {
        if (!overkill) document.getElementById("grave-place").innerHTML += "<img src='./media/skull4.png' width='60' height=auto>";
    }
    if (graveCounter > 150) {
        if (!overkill) document.getElementById("grave-place").innerHTML += "<img src='./media/skull5.png' width='70' height=auto>";
    }
    if (graveCounter % 10 == 0) {
        document.getElementById("grave-place").innerHTML += "<br>"
    }
    return;
}

let audioLvlup = new Audio('./media/levelup.mp3');
function upgrade(choice) {
    switch (choice) {
        case 1:
            player.MAXHP += playerHPUpgrade;
            break;
        case 2:
            player.AD += playerADUpgrade;
            break;
        case 3:
            player.AP += Math.round(playerAPUpgrade);
            playerAPUpgrade += (Math.pow((1 / 1.3), playerAPUpgrade));
            break;
        case 4:
            player.Armour += playerArmourUpgrade;
            break;
        case 5:
            player.Pen += playerPenUpgrade;
            break;
        case 6:
            player.Cleave += playerCleaveUpgrade;
            break;
        case 7:
            player.CritChance += playerCritChanceUpgrade;
            break;
        case 8:
            player.CritDamage += playerCritDMGUpgrade;
            break;
    }
    audioLvlup.play();
    player.HP = player.MAXHP;
    document.getElementById("uiPlayerAttack").outerHTML = '<button id="uiPlayerAttack" onmousedown="attack()">Attack</button>';
    allowAttack = 1;
    startGame();
}

function displayUpgradeMenu() {
    document.getElementById("uiPlayerAttack").outerHTML = '<button id="uiPlayerAttack" style="background:grey;">Attack</button>'
    uiPlayerHealth.innerHTML = player.MAXHP + ' <button onmousedown="upgrade(1)">+' + playerHPUpgrade + '</button>'
    uiPlayerAD.innerHTML = player.AD + ' <button onmousedown="upgrade(2)">+' + playerADUpgrade + '</button>'
    uiPlayerAP.innerHTML = player.AP + ' <button onmousedown="upgrade(3)">+' + Math.round(playerAPUpgrade) + '</button>'
    uiPlayerArmour.innerHTML = player.Armour + ' <button onmousedown="upgrade(4)">+' + playerArmourUpgrade + '</button>'
    uiPlayerPen.innerHTML = player.Pen + ' <button onmousedown="upgrade(5)">+' + playerPenUpgrade + ' </button>'
    uiPlayerCleave.innerHTML = player.Cleave + ' <button onmousedown="upgrade(6)">+' + playerCleaveUpgrade + '</button>'
    uiPlayerCritChance.innerHTML = player.CritChance + ' <button onmousedown="upgrade(7)">+' + playerCritChanceUpgrade + '</button>'
    uiPlayerCritDamage.innerHTML = player.CritDamage + ' <button onmousedown="upgrade(8)">+' + playerCritDMGUpgrade + '</button>'
    return;
}

function levelup() {
    allowAttack = 0;
    player.EXP -= player.REXP;
    player.LVL++;
    player.REXP = Math.floor(player.REXP * 1.1 + 10);
    displayUpgradeMenu();
    return;
}