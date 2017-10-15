/**
 * 階層を持つコンポーネントのテスト
 * Component2		TABLE～TBODYタグを表示。
 * 					配列データから子コンポーネントを生成する。
 * 					子コンポーネントがクリックされた回数の合計を保持する。
 * 					
 * 	ChildComponent	-TRタグを表示。
 * 					子コンポーネントを表示する。
 * 					クリックされる毎に色を切り替える。
 * 					自分がクリックされた回数を保持する。
 * 					クリックされたら親のクリック回数を加算する。
 */

//いちいちReact.createElementと書くのが面倒な場合。
//const e = React.createElement;	

    /**
     * tableタグの描画コンポーネント
     **/
    class Component2 extends React.Component{
        //コンストラクター。
    	//インスタンス生成時ではなく、コンポーネントの配置時に実行される！
        constructor(props){
            super(props);   //コンストラクタをオーバーライドする場合、必ず最初にこの１行。

            //コンポーネント生成時のパラメータがpropsに入ってくる。これは変更できない。
            //コンポーネント生成後に変更されるデータはstateに逐次格納するらしい。
            this.state = {
            	//子コンポーネント生成用のデータ
                data : [
                    {
                        key : "0001",
                        value : "値１"
                    },
                    {
                        key : "0002",
                        value : "値２"
                    },
                    {
                        key : "0003",
                        value : "値３"
                    }
                ],
                //クリックされた回数の合計。
                clickCount : 0
            };
        }
        //データ分のTRタグの描画。
        //state.dataの要素ごとに、TR表示用のコンポーネントを生成する。
        render(){
            //ループ制御
            //console.log('render outer');
        	var e = React.createElement;
            var childNodes = this.state.data.map((c, i) => {
                return(
                    //１行分の明細を生成。描画は更に子コンポーネントに移譲。
                    e(ChildComponent,{
                        val : c.value,
                        _key : c.key,
                        key : i,
                        callback1 : this.addClickCount.bind(this)
                    },null)
                );
            });
            //生成されたコンポーネントの配列をtableタグで囲んで描画。
        	var e = React.createElement;
            return(
                e('div',null,
                    e('table',null,
                        e('thead',null,
                            e('tr',null,
                                e('th',null,'click!'),
                                e('th',null,'value'),
                                e('th',null,'count')
                            )
                        ),
                        e('tbody',null,childNodes)	/** ここに子コンポーネントを挿入 **/
                    ),
                    e('p',null,`全部で${this.state.clickCount}回クリックされました。`)
                )
            );
        }
        addClickCount(){
            this.setState({
                clickCount : this.state.clickCount + 1  //クセでthis.state.clickCount++とやってしまいがちだけど、直接stateを更新するのでNG。
            });
        }
    };
    /**
     *  trタグの描画コンポーネント
     **/
    class ChildComponent extends React.Component{
        //コンストラクター。
        constructor(props){
            super(props);
            //completeの値により、classを切り替えんとす。
            this.state = {
                completed : false,
                count : 0
            };
            //クリック時のイベント処理。
            //イベント処理なのでクリックされた要素がthisになるので、
            //thisをコンポーネントにバインドしておく。
            this.handleClick = this.handleClick.bind(this);
        }
        //描画。
        //コンポーネント呼び出し時に指定した値はpropから参照できる。
        //スタイルクラスはclassではなくclassNameで指定するとのこと。ここでは計算結果を指定。
        //クリック時のイベントハンドラを指定。
        //
        render(){
        	var e = React.createElement;
            //console.log('render innner');
            return(
                e('tr',null,
                    e('td',
                        { onClick : this.handleClick },
                        this.props._key),
                    e('td',
                        { className : this.getClassName()},
                        `${this.props.val}`),
                    e('td',
                        null,
                        `${this.state.count}回クリックされまた。`)
                )
            );
        }
        
        //デバッグ用。描画完了後に呼び出されるらしい。
        componentDidUpdate(){
            //console.log(this.state.completed);
            //console.log(this.state.count);
            //console.log('--------');
        }
        //クリック時にstateを変更する。変更により自動でrenderが実行される。
        //ただし、再描画は遅延実行される。（デバッガ出力内容ご参照）
        //直接status値を書き換えず、かならずsetState経由とのこと。
        handleClick(){
            this.setState({
                completed : !(this.state.completed),
                count : this.state.count + 1
            });
            this.props.callback1();
            //console.log(this.state.completed);
            //console.log(this.state.count);
            //console.log('↓');
        }
        //スタイルクラスの計算
        getClassName(){
            if(this.state.completed){
                return "completed";
            }else{
                return "incompleted";
            }
        }
    };
