  // 状态机
  export class StateMachine<T>
  {
      // 状态列表 不允许重复状态
      private m_dicState: Map<number, State<T>> = new Map<number,State<T>>();

      private m_Owner:T ;  // 状态所有者

      // 当前状态
      private m_curState:State<T> = null;
      public  BeforeStateId:number = 0;

      constructor(owner:T)
      {
         this.m_Owner = owner;
      }

      public  RegisterState(s:State<T>):void
      {
          if (!this.m_dicState.has(s.GetStateID()))
          {
            this.m_dicState.set(s.GetStateID(), s);
          }
      }

      public  UnRegisterState(nStateID:number):void
      {
          if (!this.m_dicState.has(nStateID))
          {
            this.m_dicState.delete(nStateID);
          }
      }

      public  UnRegisterAllState():void
      {
          this.m_dicState.clear();
      }

      public GetOwner():T { return this.m_Owner; }

      public  GetCurState():State<T>
      {
          return this.m_curState;
      }

      public GetCurStateID():number
      {
          if( this.m_curState != null )
          {
              return this.m_curState.GetStateID();
          }

          return -1;
      }

      // 添加状态
      public  ChangeState( nStateID:number, param:any):void
      {
          let  tarState:State<T> = null;
          if (this.m_dicState.has(nStateID))
          {
              tarState=this.m_dicState.get(nStateID);
              if( this.m_curState != null )
              {
                this.m_curState.Leave();
                this.BeforeStateId = this.m_curState.GetStateID();
              }

              //State s;
              //m_dicState.TryGetValue(nStateID, out s);
              if (tarState != null)
              {
                this.m_curState = tarState;
                this.m_curState.Enter(param);
              }
          }
          else
          {
              // 状态不支持
          }
      }
      public  Update(dt:number):void
      {
          if( this.m_curState != null )
          {
            this.m_curState.Update(dt);
          }
      }

      public  OnEvent(nEventID:number,param:any):void
      {
          if (this.m_curState != null)
          {
            this.m_curState.OnEvent(nEventID, param);
          }
      }

  }
 // 状态接口
 export abstract class State<T>
 {
     protected m_Statemachine:StateMachine<T>  = null;


     protected m_nStateID:number = 0;

     constructor(machine:StateMachine<T>)
     {
        this.m_Statemachine = machine;
     }
     // 进入状态
     abstract  Enter(param:any):void
     
     // 退出状态
     abstract  Leave():void 

     abstract  Update(dt:number):void 

     abstract  OnEvent(EventID:number,param:any):void

     public  GetStateID():number { return this.m_nStateID; }
 }