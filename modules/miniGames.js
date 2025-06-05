/**
 * 答题小游戏
 */
export function showQuizGame(scene, onComplete) {
  const questions = [
    {
      q: '遇到有人送你贵重礼物，你应该怎么做？',
      options: [
        { text: 'A. 礼貌拒绝并说明原因', correct: true },
        { text: 'B. 收下礼物，事后归还', correct: false },
        { text: 'C. 不理睬，假装没看到', correct: false }
      ]
    },
    {
      q: '下列哪项属于廉洁自律的表现？',
      options: [
        { text: 'A. 公私分明，秉公用权', correct: true },
        { text: 'B. 收受礼品但不声张', correct: false },
        { text: 'C. 利用职权为亲友谋利', correct: false }
      ]
    }
  ];
  let current = 0, score = 0, quizBtns = [];
  const dialogCenterX = scene.cameras.main.width/2;
  const dialogCenterY = scene.cameras.main.height/2;
  let dialogText = scene.add.text(dialogCenterX, dialogCenterY-60, '', {
    fontSize: '22px', fill: '#fff', fontFamily: 'Ma Shan Zheng', align: 'center', wordWrap: { width: 320 }
  }).setOrigin(0.5).setDepth(120);

  function cleanup() {
    quizBtns.forEach(b => b && b.destroy && b.destroy());
    quizBtns = [];
    dialogText && dialogText.destroy && dialogText.destroy();
  }

  function showQuestion(idx) {
    dialogText.setText(`【廉洁知识闯关】\n${questions[idx].q}`);
    quizBtns.forEach(b=>b.destroy());
    quizBtns = [];
    questions[idx].options.forEach((opt, i) => {
      let btn = scene.add.text(dialogCenterX, dialogCenterY+10+i*54, opt.text, {
        fontSize: '20px', fill: '#fff', backgroundColor: '#1e90ff', padding: { x: 24, y: 12 }, borderRadius: 18,
        fontFamily: 'Ma Shan Zheng', align: 'center'
      }).setOrigin(0.5).setDepth(121).setInteractive();
      quizBtns.push(btn);
      btn.on('pointerdown', () => {
        quizBtns.forEach(b=>b.destroy());
        if(opt.correct) score += 1;
        if(idx < questions.length-1) {
          dialogText.setText('已记录，进入下一题...');
          setTimeout(() => showQuestion(idx+1), 800);
        } else {
          let msg = `闯关完成！本次答对${score}题。`;
          dialogText.setText(msg);
          setTimeout(() => {
            dialogText.destroy();
            if (onComplete) onComplete(score);
          }, 1200);
        }
      });
      btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#00bfff', scale: 1.06 }));
      btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#1e90ff', scale: 1 }));
    });
  }
  showQuestion(0);
}

/**
 * 找茬小游戏（简化版，点击错误点）
 */
export function showFindDifferenceGame(scene, onComplete) {
  let score = 0, total = 3;
  let dialogCenterX = scene.cameras.main.width/2;
  let dialogCenterY = scene.cameras.main.height/2;
  // 背景和图片
  let bg = scene.add.rectangle(dialogCenterX, dialogCenterY, 320, 200, 0xf0f8ff, 0.98).setDepth(120);
  let img = scene.add.image(dialogCenterX, dialogCenterY, 'office_diff').setScale(0.5).setDepth(121);
  let txt = scene.add.text(dialogCenterX, dialogCenterY-80, '请找出图片中的3处异常', {
    fontSize: '20px', fill: '#1e90ff', fontFamily: 'Ma Shan Zheng'
  }).setOrigin(0.5).setDepth(122);

  // 推荐：将异常点坐标放在图片细节处（举例）
  const points = [
    { x: dialogCenterX - 48, y: dialogCenterY - 22 },
    { x: dialogCenterX + 36, y: dialogCenterY + 18 },
    { x: dialogCenterX - 10, y: dialogCenterY + 52 }
  ];
  // 也可随机微调
  points.forEach(p => {
    p.x += (Math.random()-0.5)*10;
    p.y += (Math.random()-0.5)*10;
  });

  let found = [false, false, false];
  let covers = points.map((p, i) => {
    // 更小、更淡的异常点
    let c = scene.add.circle(p.x, p.y, 8, 0xcccccc, 0.3)
      .setDepth(123)
      .setInteractive({ useHandCursor: true });
    c.on('pointerdown', () => {
      if (!found[i]) {
        found[i] = true;
        c.setFillStyle(0x00ff88, 0.5);
        c.disableInteractive();
        score++;
        if (score === total) {
          txt.setText('全部找对！');
          setTimeout(() => {
            [bg, img, txt, ...covers].forEach(o=>o.destroy());
            if (onComplete) onComplete(score);
          }, 1000);
        }
      }
    });
    return c;
  });
}

/**
 * 拖拽排序小游戏
 */
export function showDragSortGame(scene, onComplete) {
  let dialogCenterX = scene.cameras.main.width/2;
  let dialogCenterY = scene.cameras.main.height/2;

  // 游戏介绍（加粗、下移）
  let intro = scene.add.text(dialogCenterX, dialogCenterY-70, 
    '请将下方行为拖入对应区域：\n左侧为“廉洁行为”，右侧为“不廉洁行为”', 
    { fontSize: '20px', fill: '#fff', fontWeight: 'bold', fontFamily: 'Ma Shan Zheng', align: 'center', wordWrap: { width: 340 } }
  ).setOrigin(0.5).setDepth(230);

  // 更明显的区域框
  let area1 = scene.add.rectangle(dialogCenterX-90, dialogCenterY+70, 140, 70, 0x1e90ff, 0.25)
    .setStrokeStyle(4, 0x1e90ff, 1).setDepth(120);
  let area2 = scene.add.rectangle(dialogCenterX+90, dialogCenterY+70, 140, 70, 0xff8888, 0.25)
    .setStrokeStyle(4, 0xff8888, 1).setDepth(120);

  let txt1 = scene.add.text(dialogCenterX-90, dialogCenterY+110, '廉洁行为', { fontSize: '18px', fill: '#1e90ff', fontWeight: 'bold' }).setOrigin(0.5).setDepth(121);
  let txt2 = scene.add.text(dialogCenterX+90, dialogCenterY+110, '不廉洁行为', { fontSize: '18px', fill: '#ff8888', fontWeight: 'bold' }).setOrigin(0.5).setDepth(121);

  // 更多选项，随机顺序
  let items = [
    { text: '拒绝回扣', correct: 1 },
    { text: '收受礼品', correct: 2 },
    { text: '主动报告问题', correct: 1 },
    { text: '利用职权谋私利', correct: 2 }
  ].sort(() => Math.random() - 0.5);

  // 垂直居中排列四个选项
let startY = dialogCenterY - 10; // 比如题目在 dialogCenterY-70，这里-10可避免遮挡
let startX = dialogCenterX - 60; // 左侧起点

let draggables = items.map((item, i) => {
  // 两列两行排布
  let col = i % 2;
  let row = Math.floor(i / 2);
  let t = scene.add.text(startX + col * 120, startY + row * 40, item.text, {
    fontSize: '18px', fill: '#333', backgroundColor: '#fff', padding: { x: 14, y: 8 }, borderRadius: 8
  }).setOrigin(0.5).setDepth(122).setInteractive({ draggable: true });
  t.input.dropZone = null;
  t.setData('correct', item.correct);
  scene.input.setDraggable(t);
  t.defaultX = t.x;
  t.defaultY = t.y;
  t.on('dragstart', () => { intro && intro.destroy(); });
  return t;
});

  let correct = 0;
  scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX; gameObject.y = dragY;
    // 拖动时隐藏介绍
    intro && intro.destroy();
  });
  scene.input.on('dragend', (pointer, gameObject) => {
    let inArea1 = Phaser.Geom.Rectangle.Contains(area1.getBounds(), gameObject.x, gameObject.y);
    let inArea2 = Phaser.Geom.Rectangle.Contains(area2.getBounds(), gameObject.x, gameObject.y);
    let answer = (inArea1 ? 1 : (inArea2 ? 2 : 0));
    if (answer === gameObject.getData('correct')) {
      if (answer === 1) gameObject.setFill('#1e90ff');
      if (answer === 2) gameObject.setFill('#ff8888');
      gameObject.disableInteractive();
      correct++;
    } else if (answer !== 0) {
      gameObject.setFill('#ff0000');
      scene.time.delayedCall(600, () => {
        gameObject.setFill('#333');
        gameObject.x = gameObject.defaultX;
        gameObject.y = gameObject.defaultY;
      });
    } else {
      gameObject.x = gameObject.defaultX;
      gameObject.y = gameObject.defaultY;
    }
    if (correct === items.length) {
      scene.time.delayedCall(800, () => {
        [area1, area2, txt1, txt2, intro, ...draggables].forEach(o=>o && o.destroy && o.destroy());
        if (onComplete) onComplete(true);
      });
    }
  });
}
/**
 * 连连看小游戏（如需用在第二幕，直接调用 showLinkGame）
 */
export function showLinkGame(scene, onComplete) {
  // 游戏介绍
  const dialogCenterX = scene.cameras.main.width / 2;
  const dialogCenterY = scene.cameras.main.height / 2;
  let intro = scene.add.text(dialogCenterX, dialogCenterY - 100, 
    '【连连看】请配对所有相同的图标', 
    { fontSize: '22px', fill: '#fff', fontWeight: 'bold', fontFamily: 'Ma Shan Zheng', align: 'center' }
  ).setOrigin(0.5).setDepth(120);

  // 配对内容更丰富
  const icons = ['礼', '家', '医', '电', '书', '友'];
  let pairs = icons.concat(icons).sort(() => Math.random() - 0.5); // 12个
  let btns = [];
  let selected = [], matched = [];
  let cols = 6, rows = 2;
  let btnW = 64, btnH = 64, gapX = 28, gapY = 30;
  let startX = dialogCenterX - ((cols - 1) * (btnW + gapX)) / 2;
  let startY = dialogCenterY - 40; // 向下移，避免压到介绍

  //let dialogText = scene.add.text(dialogCenterX, dialogCenterY - 90, '请配对相同图标', {
   // fontSize: '24px', fill: '#1e90ff', fontFamily: 'Ma Shan Zheng', align: 'center'
 // }).setOrigin(0.5).setDepth(120);

  for (let i = 0; i < pairs.length; i++) {
    let row = Math.floor(i / cols);
    let col = i % cols;
    let btn = scene.add.text(
      startX + col * (btnW + gapX),
      startY + row * (btnH + gapY),
      pairs[i],
      {
        fontSize: '32px',
        fill: '#fff',
        backgroundColor: '#1e90ff',
        padding: { x: 18, y: 12 },
        borderRadius: 16,
        fontFamily: 'Ma Shan Zheng',
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(121).setInteractive();
    btns.push(btn);

    btn.on('pointerdown', () => {
      if (matched.includes(i) || selected.length === 2 || selected.some(sel => sel.idx === i)) return;
      btn.setStyle({ backgroundColor: '#00bfff' });
      selected.push({ idx: i, icon: pairs[i] });

      if (selected.length === 2) {
        if (selected[0].icon === selected[1].icon && selected[0].idx !== selected[1].idx) {
          matched.push(selected[0].idx, selected[1].idx);
          btns[selected[0].idx].setStyle({ backgroundColor: '#00cc66' });
          btns[selected[1].idx].setStyle({ backgroundColor: '#00cc66' });
          selected = [];
          if (matched.length === pairs.length) {
            //dialogText.setText('全部配对成功！');
            setTimeout(() => {
              btns.forEach(b => b.destroy());
              //dialogText.destroy();
              intro.destroy();
              if (onComplete) onComplete(true);
            }, 1000);
          }
        } else {
          scene.time.delayedCall(700, () => {
            btns[selected[0].idx].setStyle({ backgroundColor: '#1e90ff' });
            btns[selected[1].idx].setStyle({ backgroundColor: '#1e90ff' });
            selected = [];
          });
        }
      }
    });
  }
}

export function showMemoryGame(scene, onComplete) {
  const dialogCenterX = scene.cameras.main.width / 2;
  const dialogCenterY = scene.cameras.main.height / 2;
  // 游戏介绍
  let intro = scene.add.text(dialogCenterX, dialogCenterY - 100, 
    '【记忆翻牌】请翻开两张相同的牌完成配对', 
    { fontSize: '22px', fill: '#fff', fontWeight: 'bold', fontFamily: 'Ma Shan Zheng', align: 'center' }
  ).setOrigin(0.5).setDepth(120);

  const icons = ['礼', '家', '医', '电'];
  let cards = icons.concat(icons).sort(() => Math.random() - 0.5);
  let cardObjs = [];
  let selected = [];
  let matched = [];
  let rows = 2, cols = 4;
  let cardW = 72, cardH = 96, gapX = 36, gapY = 24;
  let startX = dialogCenterX - ((cols - 1) * (cardW + gapX)) / 2;
  let startY = dialogCenterY - 30; // 向下移，避免压到介绍

  //let dialogText = scene.add.text(dialogCenterX, dialogCenterY - 90, '请翻开两张相同的牌', {
   // fontSize: '24px', fill: '#1e90ff', fontFamily: 'Ma Shan Zheng', align: 'center'
  //}).setOrigin(0.5).setDepth(120);

  for (let i = 0; i < cards.length; i++) {
    let row = Math.floor(i / cols);
    let col = i % cols;
    let card = scene.add.rectangle(
      startX + col * (cardW + gapX),
      startY + row * (cardH + gapY),
      cardW, cardH, 0xffffff, 0.95
    ).setStrokeStyle(4, 0x1e90ff, 1).setDepth(121).setInteractive();
    card.cardIdx = i;
    card.flipped = false;
    card.icon = cards[i];
    card.textObj = scene.add.text(card.x, card.y, '', {
      fontSize: '36px', fill: '#222', fontFamily: 'Ma Shan Zheng', fontWeight: 'bold'
    }).setOrigin(0.5).setDepth(122);
    cardObjs.push(card);

    card.on('pointerdown', () => {
      if (card.flipped || selected.length === 2 || matched.includes(i)) return;
      card.flipped = true;
      card.setFillStyle(0x1e90ff, 0.15);
      card.textObj.setText(card.icon);
      card.textObj.setStyle({ fill: '#222' }); // 翻开后字颜色
      selected.push(card);

      if (selected.length === 2) {
        if (selected[0].icon === selected[1].icon) {
          matched.push(selected[0].cardIdx, selected[1].cardIdx);
          selected[0].setStrokeStyle(4, 0x00cc66, 1);
          selected[1].setStrokeStyle(4, 0x00cc66, 1);
          selected = [];
          if (matched.length === cards.length) {
            //dialogText.setText('全部配对成功！');
            setTimeout(() => {
              cardObjs.forEach(c => { c.destroy(); c.textObj.destroy(); });
              //dialogText.destroy();
              intro.destroy();
              if (onComplete) onComplete(true);
            }, 1000);
          }
        } else {
          scene.time.delayedCall(700, () => {
            selected.forEach(card => {
              card.flipped = false;
              card.setFillStyle(0xffffff, 0.95);
              card.setStrokeStyle(4, 0x1e90ff, 1);
              card.textObj.setText('');
              card.textObj.setStyle({ fill: '#1e90ff' }); // 复原时恢复颜色
            });
            selected = [];
          });
        }
      }
    });
  }
}