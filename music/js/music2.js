				var orr="";
				$(function(){
					$(".progress").hide();
					$(".dropdown-menu>li:first").click(function(){
						$(".progress").slideToggle(1000);
					})
					$(".dropdown-menu>li:eq(1)").click(function(){
						$(".progress>div").toggleClass("active");
					})
					$(".dropdown-menu>li:eq(3)").click(function(){
						$("#picture>div").toggleClass("animation");
					})
					$("#aa>ul>li:first").click(function(){
						$(".list-group").fadeToggle(1000);
					})
					$(".list-group>li:first").click(function(){
						$("#audio>audio").attr("src","qifengl.mp3");
						$("#Scrollinglyrics>ul").empty();
						init("qifengl.lrc","qifengl.mp3");
						var a=$("#audio>audio")[0];
						a.play();
					})
					$(".list-group>li:eq(1)").click(function(){
						$("#audio>audio").attr("src","kele.flac");
						$("#Scrollinglyrics>ul").empty();
						init("kele.lrc","kele.flac");
						var a=$("#audio>audio")[0];
						a.play();
					})
					$(".list-group>li:eq(2)").click(function(){
						$("#audio>audio").attr("src","shengqi.mp3");
						$("#Scrollinglyrics>ul").empty();
						init("shengqi.lrc","shengqi.mp3");
						var a=$("#audio>audio")[0];
						a.play();
					})
				})
				// 创建一个解析歌词的方法，需要一个文件路径
				    function parseLRC(file){
						var toggle={};
						var Scrolling=[];
				        //  创建obj对象盛放解析的内容
				        var lrcObj={};
						var content="";
						console.log(file);
				        //  使用Ajax请求数据
				        var xml=new XMLHttpRequest();
				        xml.open("get",file,true);
				        xml.send();
				        xml.onload=function(){
				            //  获得得到的字符串数据
				            var lrcString=xml.response;
				            // console.log(lrcString);
				            //  通过正则表达式匹配规定格式 如：[00:26.89] 这一路上走走停停
				            var regExp=/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/g;
				            // 循环解析每一句歌词
				           while(1){
				            //  得到匹配的歌词
				                var result=regExp.exec(lrcString);
				            //  参照结果解析匹配的歌词
				                // console.log(result);
				                if(result){
				            //      判断如果获取到匹配的结果 通过time变量接收此句歌词的时间(秒)
				                    var time=parseInt(result[1])*60+parseInt(result[2]);
				            //      通过对象属性:把每个解析到的时间匹配此时的歌词,格式obj[key:value]
				                    lrcObj[time]=result[4];
									var Scroll={
										time:parseFloat(time+'.'+result[3]),
										lrc:result[4]
									};
									Scrolling.push(Scroll);
				                }else{
				            //      如果不满足直接跳出
				                    break;
				                }
				            }
							console.log(Scrolling);
							$.each(Scrolling,function(i,v){
							content+='<li>'+v.lrc+'</li>';
							});
							$("#Scrollinglyrics ul").append(content);
				    	}
						toggle={lrcObj,Scrolling};
				        // 返回解析后得到的对象
				        return toggle;
				    }
				    // 创建初始化方法
				    function init(file,src){
				    //  通过局部变量lrcobj调用parseLRC()方法,传一个歌词文件路径
				        var lrcObj=parseLRC(file);
				    //  创建一个audio标签
				        // var audio=document.createElement("audio");
						var audio=document.getElementById("audio1")
				    //  给audio添加路径
				        audio.src=src;
				    //  添加控制按钮
				        audio.controls=true;
				    //  放到指定元素下，呈现到页面上 
				        document.getElementById("audio").appendChild(audio);
				    //  进度条 创建一个进度条 
				        var audioProgess=document.querySelector(".audioProgess");
				    //  通过oncanplay方法获取总时长
				        audio.oncanplay=function(){
				    //      把进度条最大值设置为音频的总时长
				            audioProgess.max=this.duration;
				    //      console.log(this.duration);
				        };
						console.log(lrcObj.lrcObj);

				    // 通过ontimeupdate监听音频 并通过audio里面的currentTime属性传递给lrcobj一个当前时间
				        audio.ontimeupdate=function(){
				        //  console.log(this.currentTime)
				    //      设置进度条的值为当前时间，就可以随当前时间走进度 
				            audioProgess.value=this.currentTime;
				    //      把歌词放到id为a的容器上，判断如果当前时间有歌词就显示在页面上，没有就不显示，
				    //      修正了页面出现undefined这个bug
				            document.querySelector("#lyric").innerHTML=lrcObj.lrcObj[parseInt(this.currentTime)]?
				            lrcObj.lrcObj[parseInt(this.currentTime)]:document.querySelector("#lyric").innerHTML;
					
							$.each(lrcObj.Scrolling,function(i,v){
								if(i+1<=lrcObj.Scrolling.length-1 && audioProgess.value>=lrcObj.Scrolling[i].time && audioProgess.value<=lrcObj.Scrolling[i+1].time){
									$('#Scrollinglyrics ul li').eq(i).addClass('highlight');
                					$('#Scrollinglyrics ul li').eq(i).siblings().removeClass('highlight');
									if(i>3){
										$('#Scrollinglyrics>ul').css("transform","translateY("+(-i + 4) * 20+"px)")
										// var scrollTop;
										// 	if(ep.offsetTop<eul.clientHeight*2/5){
										// 		scrollTop=0;
										// 	}else if(ep.offsetTop>(eul.clientHeight-eul.clientHeight*(3/5))){
										// 		scrollTop=eul.scrollHeight-eul.clientHeight;
										// 	}else{
										// 		scrollTop=ep.offsetTop-eul.clientHeight*2/5;
										// 	}
									}
								}else if(audioProgess.value>=lrcObj.Scrolling[i].time && i+1>lrcObj.Scrolling.length-1){
									$('#Scrollinglyrics ul li').eq(i).addClass('highlight');
                					$('#Scrollinglyrics ul li').eq(i).siblings().removeClass('highlight');
								}
							})
						}
						audio.addEventListener("play",function(){
							$('#Scrollinglyrics>ul').css("transform","translateY(0px)");
							$("#picture>div").addClass("animation");

						})
						audio.addEventListener("pause",function(){
							$("#picture>div").removeClass("animation");

						})
						audio.addEventListener("ended",function(){
								$('#Scrollinglyrics>ul').css("transform","translateY(0px)");
								$("#picture>div").removeClass("animation");

						})
				    }
					
