"use strict";
const canvas = document.querySelector("canvas"); // séléction du canvas
const ctx = canvas.getContext("2d"); // déclaration du contexte

// taille du canvas
canvas.width = 690;
canvas.height = 385;

// variable score
let showScore = window.document.getElementById("score");
let score = 0;

// charger les 6 skills dans un tableau
const skills = [];
const skillSrc = [
  "img/html.png",
  "img/css.png",
  "img/js.png",
  "img/jquery.png",
  "img/bootstrap.png",
  "img/ajax.png",
  "img/git.png",
];

// définir une position différente de chaque image chargée dans un tableau
const positions = [
  { x: 20, y: 250 },
  { x: 70, y: 150 },
  { x: 150, y: 130 },
  { x: 200, y: 230 },
  { x: 270, y: 240 },
  { x: 400, y: 200 },
  { x: 550, y: 260 },
];

// charger chaque image et dessiner sur le canvas une fois chargée
skillSrc.forEach((src, index) => {
  const img = new Image();
  img.src = src;
  img.onload = function () {
    const position = positions[index];
    ctx.drawImage(img, position.x, position.y, 60, 60); //dessin de l'image aux coordonnées x et y
  };
  skills.push(img);
});

class MotionStatus {
  constructor() {
    this.left = false;
    this.leftIntervalID = 0;
    this.top = false;
    this.topIntervalID = 0;
    this.right = false;
    this.rightIntervalID = 0;
    this.bottom = false;
    this.bottomIntervalID = 0;
    this.jump = false;
    this.jumpIntervalID = 0;
  }
}

class AnimationStatus {
  constructor() {
    this.left = false;
    this.leftIntervalID = 0;
    this.top = false;
    this.topIntervalID = 0;
    this.right = false;
    this.rightIntervalID = 0;
    this.bottom = false;
    this.bottomIntervalID = 0;
    this.jump = false;
    this.jumpIntervalID = 0;
  }
}

class MaskSize {
  constructor(w, h) {
    this.width = w;
    this.height = h;
  }
}

class SpritePosition {
  constructor(t, l) {
    this.top = t;
    this.left = l;
  }
}

class Interpolation {
  constructor(w, h, t, l) {
    this.masque = new MaskSize(w, h);
    this.sprite = new SpritePosition(t, l);
  }
}

// class permettant le positionnement du sprite au mouvement en fonction de w,h,t,l
class Game {
  constructor() {
    this.motionStatus = new MotionStatus();
    this.animationStatus = new AnimationStatus();
    this.spritePosition = {
      walking: [
        new Interpolation("50px", "65px", "0px", "-20px"),
        new Interpolation("50px", "65px", "0px", "-85px"),
        new Interpolation("50px", "65px", "0px", "-150px"),
        new Interpolation("50px", "65px", "0px", "-215px"),
        new Interpolation("50px", "65px", "0px", "-280px"),
        new Interpolation("50px", "65px", "0px", "-345px"),
        new Interpolation("50px", "65px", "0px", "-410px"),
        new Interpolation("50px", "65px", "0px", "-475px"),
      ],
      jumping: [
        new Interpolation("50px", "65px", "-140px", "-20px"),
        new Interpolation("50px", "65px", "-140px", "-85px"),
        new Interpolation("50px", "65px", "-140px", "-150px"),
        new Interpolation("50px", "65px", "-140px", "-215px"),
        new Interpolation("50px", "65px", "-140px", "-280px"),
      ],
    };
  }
  //positionnement de l'avatar
  initializeAvatar() {
    this.avatar.style.top = "260px";
    this.avatar.style.left = "350px";
    this.avatar.style.width = "60px";
    this.avatar.style.height = "65px";
    this.avatar.style.position = "absolute";
  }

  //positionnement du masque
  initializeMask() {
    this.masque.style.top = "0px";
    this.masque.style.left = "0px";
    this.masque.style.width = "50px";
    this.masque.style.height = "65px";
    this.masque.style.overflow = "hidden";
    this.masque.style.position = "relative";
    //this.masque.style.border = "1px solid pink"; // aide visu pour encadrer le sprite souhaité - à mettre en commentaire pour la publication
  }

  //positionnement du sprite
  initializeSprite() {
    this.sprite.style.top = "0px";
    this.sprite.style.left = "-20px";
    this.sprite.style.width = "600px";
    this.sprite.style.position = "absolute";
  }

  move(direction) {
    let increment = 1;
    switch (direction) {
      case "left":
        increment = -1;
        break;
    }
    this.avatar.style.left =
      parseFloat(this.avatar.style.left) + increment + "px";
    this.checkCollisions();
    this.redraw();
  }

  //utilisation du même sprite effet miroir
  walkingAnimation(direction) {
    switch (direction) {
      case "left":
        this.masque.style.transform = "scaleX(-1)";
        break;
      case "right":
        this.masque.style.transform = "scaleX(1)";
        break;
    }
    let i = 0;
    const walkingAnimationIdentifier = window.setInterval(() => {
      if (i >= this.spritePosition.walking.length) {
        i = 0;
      }
      this.masque.style.width = this.spritePosition.walking[i].masque.width;
      this.masque.style.height = this.spritePosition.walking[i].masque.height;
      this.sprite.style.left = this.spritePosition.walking[i].sprite.left;
      this.sprite.style.top = this.spritePosition.walking[i].sprite.top;
      if (i < this.spritePosition.walking.length) {
        i++;
      }
    }, 150);
    return walkingAnimationIdentifier;
  }

  jump() {
    this.motionStatus.jumping = true;
    const initialTop = parseFloat(this.avatar.style.top);
    const maxHeight = 150; // Hauteur du saut
    let up = true;
    let height = 0;

    const jumpIntervalID = window.setInterval(() => {
      if (up) {
        height += 5;
        if (height >= maxHeight) up = false;
      } else {
        height -= 5;
        if (height <= 0) {
          height = 0;
          this.motionStatus.jumping = false;
          window.clearInterval(jumpIntervalID);
        }
      }
      this.avatar.style.top = initialTop - height + "px";
      //this.checkCollisions();
      //this.redraw();
    }, 25);

    let i = 0;
    const jumpAnimationID = window.setInterval(() => {
      if (i >= this.spritePosition.jumping.length) {
        i = 0;
      }
      this.masque.style.width = this.spritePosition.jumping[i].masque.width;
      this.masque.style.height = this.spritePosition.jumping[i].masque.height;
      this.sprite.style.left = this.spritePosition.jumping[i].sprite.left;
      this.sprite.style.top = this.spritePosition.jumping[i].sprite.top;
      if (i < this.spritePosition.jumping.length) {
        i++;
      }
    }, 150);
    return jumpAnimationID;
  }

  checkCollisions() {
    const avatarRect = {
      x: parseFloat(this.avatar.style.left),
      y: parseFloat(this.avatar.style.top),
      width: parseFloat(this.avatar.style.width),
      height: parseFloat(this.avatar.style.height),
    };

    for (let i = 0; i < positions.length; i++) {
      const skillRect = positions[i];

      if (
        avatarRect.x < skillRect.x + 400 + 60 && // 400 est nécessaire pour le bon positionnement de la pièce par rapport à l'avatar et 60 correspond à la width
        avatarRect.x + avatarRect.width > skillRect.x + 400 &&
        avatarRect.y < skillRect.y + 60 &&
        avatarRect.y + avatarRect.height > skillRect.y
      ) {
        console.log("coucou i = " + i);

        // Collision detectée, retrait de skill
        positions.splice(i, 1); // Retrait de la position
        skills.splice(i, 1); // Retrait de la skill touchée

        // Incrementation du score
        score++;
        showScore.innerText = "SCORE: " + score;

        // Score max de 7
        if (score >= 7) {
          alert(
            "Félicitations ! Vous avez attrapé toutes les compétences! Vous pouvez à présent télécharger mon CV"
          );
          document.getElementById("downloadCV").style.display = "block";
        }

        break; // Break after removing one skill to avoid issues with index changes
      }
    }
  }

  redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // efface le caneva
    // Redessine les skills restantes
    skillSrc.forEach((src, index) => {
      if (index < positions.length) {
        const img = skills[index];
        const position = positions[index];
        ctx.drawImage(img, position.x, position.y, 60, 60);
      }
    });
  }

  initialize() {
    window.addEventListener("DOMContentLoaded", () => {
      this.avatar = window.document.querySelector("#avatar");
      this.masque = window.document.querySelector("#masque");
      this.sprite = window.document.querySelector("#sprite");

      this.initializeAvatar();
      this.initializeMask();
      this.initializeSprite();

      window.addEventListener("keydown", (keyboardEvent) => {
        switch (keyboardEvent.key) {
          case "ArrowLeft":
            if (!this.motionStatus.left) {
              this.motionStatus.left = true;
              window.clearInterval(this.motionStatus.rightIntervalID);
              this.motionStatus.right = false;
              window.clearInterval(this.animationStatus.rightIntervalID);
              this.animationStatus.leftIntervalID =
                this.walkingAnimation("left");
              this.motionStatus.leftIntervalID = window.setInterval(() => {
                this.move("left");
              }, 25);
            }
            break;
          case "ArrowRight":
            if (!this.motionStatus.right) {
              this.motionStatus.right = true;
              window.clearInterval(this.motionStatus.leftIntervalID);
              this.motionStatus.left = false;
              window.clearInterval(this.animationStatus.leftIntervalID);
              this.animationStatus.rightIntervalID =
                this.walkingAnimation("right");
              this.motionStatus.rightIntervalID = window.setInterval(() => {
                this.move("right");
              }, 25);
            }
            break;
          case " ":
            if (!this.motionStatus.jumping) {
              this.motionStatus.jump = true;
              window.clearInterval(this.motionStatus.leftIntervalID);
              this.motionStatus.left = false;
              window.clearInterval(this.animationStatus.leftIntervalID);
              window.clearInterval(this.motionStatus.leftIntervalID);
              this.motionStatus.right = false;
              window.clearInterval(this.animationStatus.rightIntervalID);
              this.animationStatus.jumpIntervalID = this.jump("jump");
              this.motionStatus.jumpIntervalID = window.setInterval(() => {
                this.move("jump");
              }, 25);
            }
            break;
        }
      });
      window.addEventListener("keyup", (keyboardEvent) => {
        switch (keyboardEvent.key) {
          case "ArrowLeft":
            window.clearInterval(this.motionStatus.leftIntervalID);
            window.clearInterval(this.animationStatus.leftIntervalID);
            this.motionStatus.left = false;
            break;
          case "ArrowRight":
            window.clearInterval(this.motionStatus.rightIntervalID);
            window.clearInterval(this.animationStatus.rightIntervalID);
            this.motionStatus.right = false;
            break;
          case " ":
            window.clearInterval(this.motionStatus.jumpIntervalID);
            window.clearInterval(this.animationStatus.jumpIntervalID);
            this.motionStatus.jump = false;
            break;
        }
      });
    });
  }
}

const game = new Game();
game.initialize();
