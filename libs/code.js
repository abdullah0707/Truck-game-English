var canvas,
  stage,
  exportRoot,
  anim_container,
  dom_overlay_container,
  fnStartAnimation;

var overAll = [];

var soundsArr,
  isSoundPlaying = false;
var numOfButtons = 6,
  currentB = 0,
  soundPlaying = null;
var clickSd;
var l = console.log;

function init()
{
  canvas = document.getElementById("canvas");
  anim_container = document.getElementById("animation_container");
  dom_overlay_container = document.getElementById("dom_overlay_container");
  var comp = AdobeAn.getComposition("408292AC3776E24AAB02E31523103004");
  var lib = comp.getLibrary();
  var loader = new createjs.LoadQueue(false);
  loader.addEventListener("fileload", function (evt)
  {
    handleFileLoad(evt, comp);
  });
  loader.addEventListener("complete", function (evt)
  {
    handleComplete(evt, comp);
  });
  var lib = comp.getLibrary();
  loader.loadManifest(lib.properties.manifest);
}

function handleFileLoad(evt, comp)
{
  var images = comp.getImages();
  if (evt && evt.item.type == "image")
  {
    images[evt.item.id] = evt.result;
  }
}

function handleComplete(evt, comp)
{
  //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
  var lib = comp.getLibrary();
  var ss = comp.getSpriteSheet();
  var queue = evt.target;
  var ssMetadata = lib.ssMetadata;
  for (i = 0; i < ssMetadata.length; i++)
  {
    ss[ssMetadata[i].name] = new createjs.SpriteSheet({
      images: [queue.getResult(ssMetadata[i].name)],
      frames: ssMetadata[i].frames,
    });
  }
  exportRoot = new lib.Truck3E();
  stage = new lib.Stage(canvas);
  //Registers the "tick" event listener.
  fnStartAnimation = function ()
  {
    stage.addChild(exportRoot);
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage);
    document.ontouchmove = function (e)
    {
      e.preventDefault();
    };
    stage.mouseMoveOutside = true;
    stage.update();
    createjs.Ticker.setFPS(lib.properties.fps);
    createjs.Ticker.addEventListener("tick", stage);
    prepareTheStage();
  };
  //Code to support hidpi screens and responsive scaling.
  function makeResponsive(isResp, respDim, isScale, scaleType)
  {
    var lastW,
      lastH,
      lastS = 1;
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function resizeCanvas()
    {
      var w = lib.properties.width,
        h = lib.properties.height;
      var iw = window.innerWidth,
        ih = window.innerHeight;
      var pRatio = window.devicePixelRatio || 1,
        xRatio = iw / w,
        yRatio = ih / h,
        sRatio = 1;
      if (isResp)
      {
        if (
          (respDim == "width" && lastW == iw) ||
          (respDim == "height" && lastH == ih)
        )
        {
          sRatio = lastS;
        } else if (!isScale)
        {
          if (iw < w || ih < h) sRatio = Math.min(xRatio, yRatio);
        } else if (scaleType == 1)
        {
          sRatio = Math.min(xRatio, yRatio);
        } else if (scaleType == 2)
        {
          sRatio = Math.max(xRatio, yRatio);
        }
      }
      canvas.width = w * pRatio * sRatio;
      canvas.height = h * pRatio * sRatio;
      canvas.style.width =
        dom_overlay_container.style.width =
        anim_container.style.width =
        w * sRatio + "px";
      canvas.style.height =
        anim_container.style.height =
        dom_overlay_container.style.height =
        h * sRatio + "px";
      stage.scaleX = pRatio * sRatio;
      stage.scaleY = pRatio * sRatio;
      lastW = iw;
      lastH = ih;
      lastS = sRatio;
      stage.tickOnUpdate = false;
      stage.update();
      stage.tickOnUpdate = true;
    }
  }
  makeResponsive(true, "both", true, 1);
  AdobeAn.compositionLoaded(lib.properties.id);
  video = document.getElementById("video");
  video.addEventListener("ended", function ()
  {
    canvas.style.display = "block";
    anim_container.style.display = "block";
    video_div.style.display = "none";
    exportRoot.gotoAndPlay();
  });
  fnStartAnimation();
  exportRoot["playBtn"].cursor = "pointer";
  exportRoot["playBtn"].addEventListener("click", playFn);
}

function playFn()
{
  video_div.style.display = "block";
  video.play();
  setTimeout(function ()
  {
    canvas.style.display = "none";
    anim_container.style.display = "none";
    exportRoot.gotoAndStop(1);
  }, 200);
}

function stopAllSounds()
{
  for (var s = 0; s < soundsArr.length; s++)
  {
    soundsArr[s].stop();
    soundsArr[s].mute(false);
  }

  // exportRoot.soundBtn.gotoAndStop(0);
  isSoundPlaying = false;
}

function prepareTheStage()
{
  clickSd = new Howl({
    src: ["sounds/click.mp3"],
  });

  overAll = [
    exportRoot["startBtn"],
  ];

  overAll.forEach(function (el)
  {
    el.cursor = "pointer";
    el.addEventListener("mouseover", overB);
    el.addEventListener("mouseout", outB);
  });
  exportRoot["startBtn"].addEventListener("click", function ()
  {
    clickSd.play();
    exportRoot.play();
  });
  soundsArr = [clickSd];
  stopAllSounds();
  // exportRoot.soundBtn.cursor = "pointer";
  // exportRoot.soundBtn.addEventListener("click", playSoundFn);

  for (let q = 1; q <= numOfButtons; q++)
  {
    for (let i = 1; i <= numOfButtons; i++)
    {
      exportRoot["w" + q]["q" + q + "_a" + i].id = i;
      exportRoot["w" + q]["q" + q + "_a" + i].placeNum = null;
    }
  }
  for (let i = 1; i <= numOfButtons; i++)
  {
    exportRoot["a" + i].id = i;
    exportRoot["w" + i].id = i;
    exportRoot["w" + i].playV = false;
  }
  hideScreens();
  hideFB();
}

function hideScreens()
{
  for (let i = 1; i <= numOfButtons; i++)
  {
    l(i);
    exportRoot["w" + i].alpha = 0;
  }
}
function hideFB()
{
  exportRoot["wrongFB"].alpha = 0;
  exportRoot["wrongFB"].playV = false;
  exportRoot["rightFB"].alpha = 0;
  exportRoot["rightFB"].playV = false;
}

function activateButtons()
{
  for (let q = 1; q <= numOfButtons; q++)
  {
    for (let i = 1; i <= numOfButtons; i++)
    {
      if (exportRoot["w" + q]["q" + q + "_a" + i].placeNum == null)
      {
        exportRoot["w" + q]["q" + q + "_a" + i].cursor = "pointer";
        exportRoot["w" + q]["q" + q + "_a" + i].gotoAndStop(0);
        exportRoot["w" + q]["q" + q + "_a" + i].addEventListener("mouseover", overB);
        exportRoot["w" + q]["q" + q + "_a" + i].addEventListener("mouseout", outB);
        exportRoot["w" + q]["q" + q + "_a" + i].addEventListener("click", clickAnsQuz);
      } else
      {
        exportRoot["w" + q]["q" + q + "_a" + i].gotoAndStop(2);
        deactivateButton();
        break;
      }
    }
  }
}
function deactivateButton()
{
  for (let q = 1; q <= numOfButtons; q++)
  {
    for (let i = 1; i <= numOfButtons; i++)
    {
      exportRoot["w" + q]["q" + q + "_a" + i].cursor = "auto";
      exportRoot["w" + q]["q" + q + "_a" + i].removeEventListener("mouseover", overB);
      exportRoot["w" + q]["q" + q + "_a" + i].removeEventListener("mouseout", outB);
      exportRoot["w" + q]["q" + q + "_a" + i].removeEventListener("click", clickAnsQuz);
    }
  }
}
function activateBtnQuz()
{
  for (let i = 1; i <= numOfButtons; i++)
  {
    exportRoot["a" + i].cursor = "pointer";
    exportRoot["a" + i].gotoAndPlay(0)
    exportRoot["a" + i].addEventListener("mouseover", over2);
    exportRoot["a" + i].addEventListener("mouseout", out);
    exportRoot["a" + i].addEventListener("click", clickFn);
  }
}
function deactivateBtnQuz()
{
  for (let i = 1; i <= numOfButtons; i++)
  {
    exportRoot["a" + i].cursor = "pointer";
    exportRoot["a" + i].removeEventListener("mouseover", over2);
    exportRoot["a" + i].removeEventListener("mouseout", out);
    exportRoot["a" + i].removeEventListener("click", clickFn);
  }
}

// Show Next Questions And Select Answer
function clickFn(e)
{
  stopAllSounds();
  clickSd.play(); // Sounds Click
  deactivateBtnQuz();
  exportRoot["w" + e.currentTarget.id].playV = true;
  exportRoot["w" + e.currentTarget.id].alpha = 1;
  exportRoot["w" + e.currentTarget.id].gotoAndPlay(0);
}

function hideClose()
{
  for (let q = 1; q <= numOfButtons; q++)
  {
    exportRoot["w" + q]["closeBtn"].cursor = "auto";
    exportRoot["w" + q]["closeBtn"].removeEventListener("click", closeFn);
    exportRoot["w" + q]["closeBtn"].removeEventListener("mouseover", overB);
    exportRoot["w" + q]["closeBtn"].removeEventListener("mouseout", outB);
  }
}
function showClose()
{
  for (let q = 1; q <= numOfButtons; q++)
  {
    exportRoot["w" + q]["closeBtn"].cursor = "pointer";
    exportRoot["w" + q]["closeBtn"].addEventListener("click", closeFn);
    exportRoot["w" + q]["closeBtn"].addEventListener("mouseover", overB);
    exportRoot["w" + q]["closeBtn"].addEventListener("mouseout", outB);
  }
}

function clickAnsQuz(e2)
{
  stopAllSounds();
  clickSd.play(); // Sounds Click
  // deactivateBtnQuz();
  e2.currentTarget.gotoAndStop(2);
  e2.currentTarget.removeEventListener("mouseover", overB);
  e2.currentTarget.removeEventListener("mouseout", outB);
  e2.currentTarget.removeEventListener("click", clickAnsQuz);
  hideClose();
  if (e2.currentTarget.id == 1)
  {
    console.log("if");
    exportRoot["rightFB"].playV = true;
    exportRoot["rightFB"].alpha = 1;
    exportRoot["rightFB"].gotoAndPlay(0);
    e2.currentTarget.placeNum = e2.currentTarget.id;
  } else
  {
    console.log("else");
    exportRoot["wrongFB"].playV = true;
    exportRoot["wrongFB"].alpha = 1;
    exportRoot["wrongFB"].gotoAndPlay(0);
  }
  deactivateButton();
}

function closeFn()
{
  clickSd.play();
  stopAllSounds();
  activateBtnQuz();
  hideScreens();
}

function closeFB()
{
  clickSd.play();
  stopAllSounds();
  activateButtons();
  hideScreens();
  hideFB();
  showClose();
}

function out(e)
{
  exportRoot["a" + e.currentTarget.id].gotoAndPlay(0);
}

function over(e)
{
  exportRoot["a" + e.currentTarget.id].gotoAndStop(1);
}
function over2(e)
{
  exportRoot["a" + e.currentTarget.id].gotoAndStop(2);
}

function outB(e)
{
  e.currentTarget.gotoAndStop(0);
}

function overB(e)
{
  e.currentTarget.gotoAndStop(2);
}