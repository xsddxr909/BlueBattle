export default class NodePool
{
    private static m_stNodePool: cc.NodePool;
    constructor()
    {

    }

    public static Init(): void
    {
        NodePool.m_stNodePool = new cc.NodePool();
        let iCnt: number = 100;
        while(iCnt--)
        {
            NodePool.m_stNodePool.put(new cc.Node());
        }
    }
    public static CheckOut(): cc.Node
    {
        if(!NodePool.m_stNodePool.size())
        {
            let iCnt: number = 100;
            while(iCnt--)
            {
                NodePool.m_stNodePool.put(new cc.Node());
            }
        }
        return NodePool.m_stNodePool.get();
    }

    public static CheckIn(node: cc.Node): void
    {
        if(node)
        {
            NodePool.m_stNodePool.put(node);
        }
    }
}
