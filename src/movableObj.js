/**
*
*movableObj对象
*
**/
cnGame.register("cnGame", function(cg) {

    var movableObj=cg.class(function(options){
        if (!(this instanceof arguments.callee)) {
            return new arguments.callee(id, options);
        }
        this.init(options);             
    }).methods({
        /**
        *初始化
        **/
        init:function(options){
            var postive_infinity=Number.POSITIVE_INFINITY;
            /**
            *默认值
            **/
            this.pos= [0,0];
            this.imgStart= [0,0];
            this.imgSize= [32,32];
            this.size= [32,32];
            this.angle= 0;
            this.speed= [0,0];
            this.a= [0,0];
            this.maxSpeed=postive_infinity;
            this.maxAngleSpeed=postive_infinity;
            this.maxPos=[postive_infinity,postive_infinity];
            this.minPos=[-postive_infinity,-postive_infinity];
            options = options || {};
            this.setOptions(options);           
            
        },
        /**
        *返回X方向速度
        **/
        getSpeedX:function(){
            return this.speed[0]*Math.cos(this.angle);
        },
        /**
        *返回Y方向速度
        **/
        getSpeedY:function(){
            return -this.speed[0]*Math.sin(this.angle);
        },
        /**
        *返回参照物相对于该对象的角度
        **/
        getRelatedAngle:function(elem){
            elem.angle=elem.getHeading()||0;
            this.angle=this.getHeading();
            var relatedAngle=elem.angle-this.angle;
            if(relatedAngle>Math.PI){
                relatedAngle=relatedAngle-Math.PI*2;
            }
            else if(relatedAngle<-Math.PI){
                relatedAngle=relatedAngle+Math.PI*2;
            }
            return relatedAngle;
        },
     
        /**
        *设置移动参数
        **/
        setOptions: function(options) {
            cg.core.extend(this, options);
        },
        /**
        *移动一定距离
        **/
        move: function(dx,dy) {
            var x = this.pos[0] + dx||0;
            var y = this.pos[1] + dy||0;
            this.pos[0] = Math.min(Math.max(this.minPos[0], x), this.maxPos[0]);
            this.pos[1] = Math.min(Math.max(this.minPos[1], y), this.maxPos[1]);
            return this;

        },
        /**
        *移动到某处
        **/
        moveTo: function(pos) {
            this.pos[0] = Math.min(Math.max(this.minPos[0], pos[0]), this.maxPos[0]);
            this.pos[1] = Math.min(Math.max(this.minPos[1], pos[1]), this.maxPos[1]);
            return this;
        },
        /**
        *旋转一定角度
        **/
        rotate: function(da) {//要旋转的角度
            da = da || 0;
            var angle=this.angle||0;
            this.angle = angle+da;
            return this;
        },
        /**
        *旋转到一定角度
        **/
        rotateTo: function(angle) {
            this.angle = angle;
            return this;
        },
        /**
        *停止移动
        **/
        stop:function(){
            /*this.preAngle=this.angle;
            this.preSpeed=this.speed;
            this.preA=this.a;*/
            this.speed=[0,0];   
            this.a=[0,0];
            return this;
        },
        /**
        *恢复移动
        **/
        resume:function(){
            this.angle=this.preAngle;
            this.speed=this.preSpeed||this.speed;
            this.a=this.preSpeed;
            return this;
        },
        /**
        *更新位置
        **/
        update: function(duration) {//duration:该帧历时 单位：秒
            //x方向速度
            var speedX = this.speed[0]*Math.cos(this.angle) + this.a[0]*Math.cos(this.angle) * duration;
            //y方向速度
            var speedY = this.speed[0]*Math.sin(this.angle) + this.a[0] *Math.sin(this.angle) * duration;
            
            
            if(Math.sqrt(speedX*speedX+speedY*speedY)>this.maxSpeed){       
                speedX=Math.cos(this.angle)*this.maxSpeed;
                speedY=Math.sin(this.angle)*this.maxSpeed;
            }
            //角速度
            
            this.speed[1] = this.speed[1] + this.a[1] * duration;
            if(this.speed[1]<-this.maxAngleSpeed){
                this.speed[1]=-this.maxAngleSpeed;
            }
            else if(this.speed[1]>this.maxAngleSpeed){
                this.speed[1]=this.maxAngleSpeed;
            }
            
            this.rotate(this.speed[1]).move(speedX, -speedY);
        
        }

    });  
    this.MovableObj=movableObj;
});