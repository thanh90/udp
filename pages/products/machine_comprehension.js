import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Buffer } from 'buffer';
import { useState, useRef, useEffect } from 'react';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import { throttle, map, orderBy, reduce } from 'lodash';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';

import DemoPage from '../../components/common/DemoPage';

let lastScrollTop = 0;
let savedTranslate = 0;

const sampleTexts = [
  '10일 충남 서천군 서면 신서천화력발전소 건설공사장에서 폭발사고가 발생했다. 경찰에 따르면 이날 오후 3시 3분쯤 신서천화력발전소 건설공사장 폭발사고로 작업자 44살 A씨가 온몸에 3도 화상을 입고 화상 전문 병원으로 옮겨져 치료를 받는 등 4명이 부상을 입었다. A씨 등은 전자기기를 테스트 중이었던 것으로 알려졌으며 경찰은 합동감식 등을 통해 폭발 원인을 조사한다는 방침이다.',
  `시초는 1899년 고종황제의 명에 의해 내탕금으로 세워진[10] 대한천일은행(大韓天一銀行). 이 은행이 1899년 조선상업은행(朝鮮商業銀行)으로 개명한 뒤 1950년 한국상업은행으로 바뀌었고 1997년 외환 위기 이듬해인 1999년 한국산업은행을 존속법인으로 하고 한일은행을 인수하여 한빛은행이 되었다. 이후 2001년 평화은행과도 합병했으며 2002년 5월에 현재의 명칭인 우리은행이 되었다. 보다시피 대한천일은행 자체가 구한말에 설립되었기 때문에 현재의 우리은행은 대한민국 첫 은행이라는 캐치프레이즈를 내세우고있다. 하지만 우리나라의 첫 은행은 우리은행이 아니라 신한은행이 맞다. 사실 이건 과거 한국상업은행도 반복했던 바 있는데, 대한천일은행보다 2년 앞서 창립된 한성은행에 대해서 '1905년 폐지되고 일제 주도로 관립 한성은행이 만들어졌으므로 이를 계승한 조흥은행(신한은행)은 민족 은행이 아니다'라는 논리를 폈다. 그러나 관립 한성은행은 기존의 한성은행이 확대 개편된 것으로 역사는 계속 이어졌으며, 그 당시의 신문 광고 등이 보존되어 있다. 특히 그렇게 따지면 대한천일은행도 1911년 일본인의 자금 지원을 받아 조선상업은행으로 개명하는 수모를 겪었기 때문에 저러한 주장은 제 얼굴에 침뱉기 격이다. 즉 대한천일은행은 명백히 한성은행보다 늦게 창립된 2번째 민족 은행이 맞으며, 이는 1996년 한국기네스협회에서 공식적으로 인정한 부분인데도 불구하고 한국상업은행 - 우리은행은 여전히 자기네 주장을 굽히지 않고 있다. 다만 신한은행의 존속법인이 조흥은행이라는 이유만으로 무조건 최초의 은행이라고만 하기는 영 껄끄러운 부분도 있다. 신한은행은 원래 신생 은행이었으면서 조흥은행을 역합병한 덕에 얼떨결에 since가 어부지리로 100년 이상 올라간 것이지만 우리은행은 그 긴 역사를 역합병 같은 것으로 거저 얻은 것이 아니라 대한천일은행, 조선상업은행, 한국상업은행으로 차근차근 모태를 유지해오다가 한일은행을 인수하고 한빛은행으로 개명, 평화은행을 인수하고 우리은행으로 개명한 것이다. 우리은행에서 국내 최초의 은행 타이틀을 포기하지 않는 가장 큰 이유는 아마 "우리는 누구처럼 역합병 같은 걸로 거저먹지 않고 꾸준히 대한천일은행을 모태로 삼아오고 있었음."이라는 인식에서 비롯된 나름의 자부심 때문일 것으로 보인다.`
  + `한편 1932년 설립된 조선신탁주식회사가 여러 차례 합병을 거쳐 1960년에 한일은행이라는 명칭으로 바뀌었고, 조상제한서의 한축을 이루며 상업은행과는 경쟁 관계였다가 1997년 외환 위기가 닥치자 휘청거리기 시작한다. 정부의 금융 구조조정 압박 속에 외자유치 등의 조건으로 퇴출을 면하긴 했으나 이렇다 할 자구 노력이 결실을 보지 못하던 와중인 1998년 7월 31일에 전격적으로 합병을 결정하여[11] 1999년 1월 4일 한빛은행이 탄생했다. 은행 존속 법인은 한국상업은행이, 비씨카드 회원사 자격은 한일은행이 승계.[12] 여담으로 한빛은행 출범 당시 규모는 대한민국 은행권 1위였다. 그러다가 2001년 국민은행과 한국주택은행이 합병하면서 한빛은행은 콩라인이 되었으며 2002년 평화은행을 합병한 뒤, 현재의 우리은행으로 은행명을 변경했다. 2006년 신한은행이 조흥은행을 흡수하여 몸집 불리기를 해 버린 바람에 3등으로 추락했고 2012년 말에 다시 2등이 되었다가 2019년 현재는 하나-국민-신한에 이어 4위다. (5위부터는 기업-SC-씨티 순) 참고로 우리금융그룹의 총 자산은 4대 은행지주 중 1위를 차지한 적도 있었다.[13][14] 우리금융지주는 계열사 분리 후 매각하는 민영화 과정에서 2014년 11월 1일에 자회사인 우리은행에 합병되어 해체되었다. 이후, 남은 계열사 중 우리은행을 제외한 계열사는 우리은행의 자회사가 되었다. 구.우리투자증권을 농협에 매각한 관계로 증권 계열사가 없어, 타행과 달리 금융복합점포에 대응할 수 없는 우리은행은 삼성증권과 제휴할 것이라는 보도가 있었다. 그리고 2015년 4월 22일, 우리은행이 삼성증권과 손잡고 금융복합점포를 연다는 보도가 나왔다. 하지만 민영화 완료 후 증권 자회사를 두어야 할 필요가 제기되기도 했는데, 쓸 만한 매물들은 죄다 팔린지라 당장은 관계가 나름 긴밀한 삼성증권과의 제휴에 힘을 쏟을 것으로 보인다. 2016년 11월 예금보험공사가 7곳의 금융 대기업에 우리은행 주식의 29.7%를 분할 매각하는 방식으로 1차 민영화를 완료하였다. 이후 2018년 초까지 남은 지분 21.36%를 추가로 매각하여 16년간 지지부진했던 민영화 여정의 마침표를 찍었다. 1차 민영화 이후 금융지주회사 설립 요구가 안팎에서 나오고 있다. 4대 대형 시중은행[15] 중 우리은행만 금융지주가 아닌 은행-계열사 체제여서 타행에 비해 경쟁력이 떨어진다는 주장이다.[16] 실제로 이광구 행장이나 은행 이사들도 금융지주화에 긍정적인 의견을 피력하고 있다. 다만 당장 증권사나 보험회사를 인수하여 금융그룹을 꾸리겠다고 하면 주주사들의 반발이 일어날 게 뻔하니(일단 주주사들과의 협력을 강화하면서 우리은행, 우리카드, 우리종합금융을 중심으로 금융지주회사를 설립한 뒤 자체적으로 증권, 보험사를 육성한다는 계획을 갖고 있다. 하지만 2018년 6월, 바로 본색을 드러내고 증권사인 교보증권 인수협상에 나섰다. 기사 교보생명은 3세 경영으로 넘어갈 때가 되면서 비핵심사업을 정리해놓고 이참에 교보증권을 정리할 것이다. 현재 케이뱅크의 대주주이며, 노조는 한국노총 금융노조 소속이다. 2. 행가[편집] 우리은행 행가 작사 정공채, 작곡 정성조 한마음 한뜻으로 사랑 가득한 날마다 새로운 기쁨 희망찬 우리은행 한결같이 찬연한 이 역사 온누리에 펼치세 오늘도 정성 다하리 세계 속 우리은행 길이 빛나리 3. 지배구조[편집] 2019년 8월 기준. 주주명 지분율 파일:대한민국 국기.png 우리금융지주 100% 4. 역대 은행장[편집] 한빛은행 시절 은행장은 한빛은행 문서 참고. 이덕훈 (2002~2004) 황영기 (2004~2007) 박해춘 (2007~2008) 이종휘 (2008~2011) 이순우 (2011~2014) 이광구 (2014~2017) 손태승 (2017~2020) 권광석 (2020~) 5. 현황[편집] 본점은 서울특별시 중구 회현동1가 서울중앙우체국 건너편의 회현사거리(남산3호터널 방향)에 있다. 이 부지는 예전에 벨기에 영사관이 있었던 자리로, 1970년에 한국상업은행이 불하받은 뒤 1982년 주변 재개발을 하는 동시에 벽돌 하나하나를 관악구 남현동으로 옮겨서 건축했다.[17] 그리고 그 부지에 한국상업은행이 새 본점을 짓기 시작해 창립 100주년인 1999년 1월 30일에 맞춰 입주할 예정이었으나, 1997년 외환 위기의 후유증으로 인해 매각까지 검토했다가 한빛은행으로 합병한 뒤 1999년 12월에 와서야 입주한 것. 한편 한국상업은행 본점은 2000년대 초중반 사무실이 추가로 필요하던 한국은행이 매입하여 현재는 한국은행 소공별관으로 사용하고 있으며, 한일은행 본점은 현 롯데 에비뉴엘이다. 지점망이 서울특별시 및 경기도 지역에 과하게 쏠려 있는 경향을 보인다.[18] 특히 후술하는 서울역 주변과 같은 도심+4대문 안이나 강남 등지에선 서울특별시의 지방은행 아닌가 처럼 보인다.[19] 단적인 예로, 우리은행 노량진지점과 동작구청지점간의 직선 거리는 150m에 불과하다. 대신에 모퉁이로 가려져 있어서 서로의 지점이 쉽게 파악되지 않는다. 서로의 지점에서 다른 지점이 인식될 수 있는 곳은 경희대학교지점과 회기동지점인데, 직선 거리로는 200m. 그러나 그 외 지방에서는 시 단위 지역임에도 불구하고 시중 빅4 중 우리은행만 없는 경우가 있다.[20][21][22] 그 이유가 전신인 한국상업은행과 한일은행은 다수 대기업의 주거래 은행이었기에 대기업의 본사가 집중된 수도권 지역에 더 많은 지점을 낼 수 밖에 없었고, 후에 합병된 평화은행의 경우도 후발 은행인지라 적은 점포가 수도권에 몰려 있었기 때문이었다. 또 한일은행, 한국상업은행 시절 말아먹은 게 워낙 많은지라 있던 지점들을 정리한 것도 한몫했다. 지점으로 곧바로 전화통화를 할 수 없고, 신한은행처럼 콜센터를 경유하여 지점으로 전화통화를 해야 하는 은행이다. 정부에서 공적자금 회수를 위해 우리금융지주의 민영화를 추진하고 있으나, 데려갈 회사가 마땅치 않아서 곤란해하고 있다. 우리금융그룹의 덩치가 너무 커서 가격이 높으니 계열사 중 우리투자증권ㆍ자산운용, 경남은행, 광주은행을 분리, 매각하여 덩치를 줄인 후 매각하자는 방안도 나오고 있다. 하나금융지주가 외환은행을 인수해서 후보자가 하나 줄어든 2010년 11월에는 우리은행이 스스로 지분을 매입해서 자체적으로 민영화하는 방안도 진지하게 검토한 것 같으나 무산되었다. 2011년에는 한국산업은행이 우리+경남+광주+우투 다 묶어서 한방에 현질하겠다고 벼르고는 있다. 하지만 주변에서 들어오는 태클에 결국 한국산업은행은 대상자에서 탈락했고 결과적으로 매각이 무산되고 말았다. 2012년에도 정부가 민영화를 추진하면서 한때 KB금융지주가 관심을 보였으나, 여당의 유력 대선 후보였던 박근혜 당시 새누리당 비상대책위원장이 "우리금융 민영화는 다음(내) 정부 때"라고 말하면서 포기했다. 2013년에는 분리 매각하기로 하고 정부가 우리금융을 산하 지방은행(광은/경은) 계열과 우리투자증권 계열, 우리은행 계열 셋으로 나눠서 팔기로 했다. 2011년부터 2년간 통 매각을 추진해 본 결과, 이만한 덩치를 사 갈 만한 국내외 인수자들이 없다고 판단했기 때문. 2013년 10월 현재 지방은행 계열과 우리투자증권 계열에 대한 예비 입찰이 진행된 상태. 이들은 이르면 올해 안에 모두 정리되고 내년에는 우리은행 계열만 남는다.[23] 이에 따라 국내 최초의 금융지주회사였던 우리금융지주는 해체된다. 정부의 4번째 민영화 시도가 또 실패했다. 기사 유력했던 교보생명이 불참하고 중국의 보험 회사인 '안방보험' 혼자서 참여하는 바람에 매각 자체가 무산, 연기되었다.[24] 종전의 방식으로는 비은행계, 비금융계, 외국계가 참여하기 힘들고, 농협.국민.신한.하나는 각각의 이유와 사정으로 인수 참여에 쉽지 않은 바, 과점주주를 구성하는 분산 매각의 가능성이 점쳐지고 있다. 2015년 7월 정부가 분리 매각 방식을 공표했는데, 놀랍게도 지분을 잘게 썰어파는 점을 이용해 산업자본에도 문호를 열 계획으로 보인다. 이미 지방은행에 산업자본이나 대기업이 지분을 투자한 사례가 있긴 하지만, 국내 시중은행 가운데 대기업 고객이 가장 많이 확보하고 있는 시중은행이라는 특성상 탈이 나지 않을 지 좀 더 신중한 검토가 필요하다. 창구거래 비중이 갈수록 줄어들면서 2014년 이후 지점 통폐합을 자주 실시하고 있다. 특히 경기도와 지방 광역시에서 빛의 속도로 지점 통합 작업이 진행 중이다. 세계 금융위기 이후 기업고객 위주의 불안정한 수익 구조를 개선하기 위해 공격적으로 지점망을 넓혔는데[25], 가계금융에도 불황이 닥치면서 다시 기존 규모로 축소를 시도하는 것이다. 2015년 9월에는 UAE의 국부 펀드인 아부다비투자공사(ADIC)가 우리은행의 지분 매입에 관심을 내비치고 있다. 그러나 하필이면 저유가가 찾아오면서(......) ADIC가 15% 이상의 확정된 수익률을 보장하라는 요구로 인해 사실상 또 물 건너갔다. 국민들은 외국계에 팔리더라도 민영화는 꼭 되어야 한다는 입장을 밝히고 있지만..... 결국 2016년 11월 13일에 1차 민영화에 성공했다. 2016년 2월 12일부터 개성공단 폐쇄 관계로 우리은행 개성지점의 업무를 우리은행 회현동1가 본점 내 임시 점포에서 본다고 한다.[26] 군 미필자의 경우, 이 은행에서 새희망홀씨 대출을 받기에는 많은 어려움이 따를 것이다. 본사 정책상 군 미필자는 원칙적으로 대출거래를 취급하지 않는다고 하니, 새희망예정에 있는 위키러는 참고하기 바란다. 국민은행보다는 심사가 까다롭지 않지만, 이 은행도 만만치 않은 것이 모든 서류에 대표자 직인과 명판이 찍혀있어야 하고 재직 중인 사업장에서 유선전화로 대표자와 직접 재직확인전화가 되어야 하며 포털사이트에 사업장이 검색되어야 심사가 완만하게 진행될 수 있다고 한다. 2016년 12월 8일 회현동1가 본점에서 위비 스마트 KIOSK를 시연했다. 이후 서울/인천/경기(고양, 용인, 성남, 안양) 지역 일부 지점의 ATM 옆에 위비 스마트 KIOSK를 설치하여 입출금통장 비대면 개설, 체크카드 발급 등 몇몇 스마트 서비스를 시행했다. 단, 키오스크에서 개설 가능한 입출금상품은 우리 SUPER 주거래 통장, 우리꿀청춘통장, 우리직장인재테크통장뿐이며, 이들을 개설한 후 인터넷뱅킹에서 다른 상품으로 전환가입은 가능하나 얄짤없이 한도제한 계좌로 나온다. 아직 수도권 외 지역 지점에 키오스크를 확대할 것에 대해서는 계획이 나오지 않았다고 한다. 2016년 말 은행업 예비인가를 받은 케이뱅크은행의 대주주로 참여하였다. 케이뱅크는 본래 KT가 주도하는 인터넷전문은행이지만, 금산분리 제도로 인해 우리은행으로부터 투자를 받았고, 그 결과 우리은행이 최대주주로 올라섰다. 이 영향을 받아 케이뱅크의 시스템도 우리은행이 운영하는 모바일 은행앱인 위비뱅크 for 우리은행의 시스템을 많이 참조해 만들어졌다. 케이뱅크에 대해서는 해당 문서 참조. 우리 금융지주가 출범되기 직전 부서 개편을 했는데 기존 3부문 20그룹 2단 64부서를 2부문 20그룹 1단 60부서로 개편했다. 기존 ‘국내·글로벌·영업지원’ 3개 부문을 ‘영업·영업지원’ 부문으로 재편하고, 시너지추진부를 신설한 점이 가장 큰 특징이다. 지주와의 협업 확대 방안을 모색하고 상호 시너지 전략을 수립하는 업무를 맡는다. ‘시니어마케팅팀’도 새롭게 만들었다. 고령화가 가속화됨에 따라 시니어 고객의 중요성이 커지며 이를 전담할 조직이 필요하다고 판단했기 때문이다. 부동산개발금융 업무를 담당할 ‘프로젝트금융부’, 우수 기술력을 보유한 벤처/스타트업 발굴을 위한 ‘혁신성장금융팀’도 신설됐다. 일부 업무는 지주사로 이관된다. 기존 은행 미래전략부, IR부는 지주 ‘재무기획부’로, 은행 비서실은 지주 ‘인사부’로 재편된다. 우리은행 관계자는 “ 연말까지 질질 끌 필요없이 빠른 조직 정비 후 준비를 하자는 것이 운행장의 인사 및 조직개편의 배경”이라며 “내년 경기침체로 인해 영업 환경이 녹록지 않을 것이라는 점을 우려하며 성공적인 금융그룹으로 첫발을 내딛기 위한 선제적인 준비에 나섰다”고 말했다. 2019년 1월 주식의 포괄적 이전을 통한 우리금융지주 회사가 출범되었다.[27] 2019년 2월 13일 공식적으로 자사주식을 매입해 우리금융지주로 출범했다. 6. 상품[편집] 파일:나무위키상세내용.png 자세한 내용은 우리은행/상품 문서를 참고하십시오. 7. 문제점[편집] 파일:나무위키상세내용.png 자세한 내용은 우리은행/문제점 문서를 참고하십시오. 8. 사건사고[편집] 파일:나무위키상세내용.png 자세한 내용은 우리은행/사건사고 문서를 참고하십시오. 9. 민영화[편집] 공적자금 회수를 위해 민영화 작업이 2010년 이후 지속적으로 진행되고 있음에도 불구하고, 뚜렷한 매수 희망자가 없어 유찰되고 있다. 공적자금 회수 극대화를 정부가 외치고 있는 상황에서 정부 지분 51.4%에 대한 매각 의지 여부가 지속적으로 제기되어 오고 있는 실정이다. 정부는 공적자금 회수 극대화, 금융산업 발전, 조기 민영화의 원칙에 입각한 민영화를 추진 중이나 결과는 지지부진한 상태다. 특히 지난 정부에서는 경영권과 소수지분을 따로 파는 등의 매각을 시도했지만 실패했다. 51.4%의 지분을 한 번에 인수할 업체를 찾기가 쉽지 않기 때문이었다. 한편, 현 정부는 투자자에게 동일 지분으로 쪼개서 파는 '과점주주 매각 방식'을 검토 중에 있다고 한다. 복수의 투자자에게 동일 지분을 매각함으로써 매각의 용이성을 보여주는 방법이지만, 반대로 지분이 쪼개지기 때문에 우리은행의 주요 주주가 분리되어 외부의 경영 간섭에 취약하다는 특징을 가지고 있다. 공적자금관리위원회는 일단 30%를 우선 매각하는 것으로 계획을 잡고 진행할 것을 천명했다. 하지만 구체적인 일정은 언급하지 않아 실행 의지에 대한 의문점이 있는 상황이다.# 우리은행에는 공적 자금이 12조 8천억이 투입된 상황인데, 이 중 회수하지 못한 금액인 4조 7천억원을 회수하기 위해서는 현 주가 대비 50% 이상 올라야 한다. 빠른 매각으로 경영안전화와 은행업황을 위해 잠정적으로 유예에 대한 토론이 학자들 사이에서 진행 중이다.# 지지부진했던 매각 계획은 경영권을 포함한 주식 전부 매각이 아닌, 4~8%의 지분 분할 매각으로 변경되면서 급물살을 타기 시작해, 2016년 9월 23일 예비 입찰자 모집이 마감되었다. 현재 18곳 정도의 예비 입찰자가 있는 것으로 알려져 있으며, 총 매수 의향 지분이 매각 예정 지분인 30%의 두 세배에 달한다. 정부는 2016년 12월까지 지분 30% 매각을 완료하고, 2017년 하반기에 잔여 지분을 모두 매각해 민영화를 완료할 예정이다. 그리고 2016년 11월 11일에 입찰을 시작하여 11월 13일에 최종적으로 결정될 것으로 보인다. 우리은행 지분 매각 본입찰에 참여한 8개 투자자 가운데 IMM프라이빗에쿼티, 한국투자증권, 키움증권, 한화생명, 동양생명, 유진자산운용, 미래에셋자산운용 등 7곳에 최대 6.0%에서 최소 3.7%의 지분을 매각하기로 했다고 발표했다.# 그리고 해당 1차 낙찰분은 2017년 1월 31일에 매각이 완료됐다. 그러면서 일부 영업점들이 또 통폐합에 들어갔다. 10. 기타[편집] 10.1. 광고[편집] 국민은행에서 김연아와 이승기를 광고모델로 현질(...)하자 위기감을 느낀 건지 새 모델을 계약했는데... 장동건을 질러 버렸다. 여자 행원들이 매우 기뻐했다고. 신한은행은 박칼린으로 뒷북 둥둥둥 급기야 중소기업은행은 송해 선생님을 모셨다[28] 한동안 포스터랑 홈페이지 등에만 등장하더니 TV광고에도 나오고 있다. 그런데 원래 우리은행 모델은 원빈이었는데.. # 위비뱅크 초창기 광고. 섬네일 표정이.. ㄷㄷ 왼쪽에 계신 분은 뭔가 활기차 보이지만 오른쪽에 있는 사람은 침울해 보이는 건 덤 위비뱅크에 초점을 맞춘 광고다. 아직도 몆몆 케이블 체널에서도 이 광고를 볼 수 있다. 반응이 좋은지 2번째 광고도 찍었다! 지상파 및 일부 케이블 채널에서 나온 광고. 예금보험공사의 제재로 인해 광고 집행을 못하고 있었다가, 무려 5년 만인 2016년 1월부터 위비뱅크 브랜드로 광고를 재개했다. 거기에 모델로 유재석을 질렀다!! 라디오 광고에 먼저 등장하기 시작해서 설날 이후론 본격적으로 TV에도 등장하고 있다. 하지만 그 전부터 WKBL 개막에 맞춰 소소하게 해오고 있긴 했었다 봄을 맞이해 홈페이지 매인화면에 유재석이 등장하고 있다. 지상파를 통한 광고가 조금은 늦었지만 반응은 좋은 편이다. 현재 우리은행 영업점 포스터 광고 상당수가 유재석으로 도배(...)되었다고 한다. 2017년 4월 말에는 박형식이 나오기 시작했다. 2019년 현재 블랙핑크가 광고에 나오고 있다. 10.2. 업무제휴[편집] 지점을 더럽게도 찾기 힘든 산업은행[29] 통장과 카드를 이 은행에서 사용할 수 있다. 한빛은행 시절이었던 2001년 5월 31일에 한국산업은행과 업무 제휴를 맺었으며, 우리은행으로 바뀐 후 현재도 산은과 업무제휴가 지속되고 있다. 물론 통장정리 & 이월은 영업점 창구 한정... 한편 우리은행 현금카드로 야간에 돈을 찾으면 상술했다시피 정신줄 놓은 수수료를 내는데, 한국산업은행의 현금카드로 우리은행 ATM에서 돈을 찾으면 야간에도 수수료를 안 무는 기염을 토할 수 있다.[30] 완전히 주객이 전도되어 있다. 그래서인지 우리은행에서 거래하는 사람들 중에는 수수료 면제용 한국산업은행 계좌를 가지고 있는 사람이 간혹 보인다. 다만 한국산업은행의 전산망 쿨타임이 매일 밤 11시부터 다음날 새벽 1시까지라 많이 불편하다. 한국산업은행의 정신줄 놓은 수수료 면제 기행은 해당 문서를 참조. 케이뱅크의 대주주로, 2017년 9월 13일부터 케이뱅크와 제휴해 수수료 없이 ATM을 사용 가능하다. 10.3. 주요 거래처[편집] 금융감독원은 주채무계열이라는 이름으로 재벌 대기업들의 주거래 은행을 해마다 선정하여 발표하는데, 2019년 기준으로 한국산업은행과 더불어 9개 대기업의 주채권 은행을 맡고 있다.[31] 특히 한일은행 시절부터 삼성그룹[32] 차원에서 주거래 관계를 유지하여 온 삼성[33]과, 역시 한일은행 시절부터 이어져 온 포스코[34]와의 관계는 대외적으로도 유명하다. 기업들은 물론 여러 은행과 거래하지만, 주채권은행이란 대출을 비롯한 가장 중요한 재무 업무를 거의 이 은행을 통해 수행한다는 뜻이 된다. 따라서 감독기관을 통해 정부와 은행이라는 일종의 공공 영역이 대기업 재무구조를 관리감독할 수 있고, 부실화되면 채권단의 입장에서 기업의 회생 절차에 영향력을 행사할 수도 있는 셈이다. 하지만, 1997, 2008년과 같은 상황이 또 도래한다거나 비자금 사건이 한 번 크게 터진다면... 한국상업은행 시절인 1960년대부터 2003년까지 청와대의 주거래 은행(효자동지점)을 맡기도 했다. 참고로 청와대 주거래 은행은 참여정부 시기 국민은행(청운동지점)으로 넘어갔다가 2008년 말(!!) 청와대 구내에 직접 은행지점을 설치하기로 하자 우리은행도 주거래 탈환에 나섰으나, 경쟁입찰 결과 NH농협은행이 선정되어 NH농협은행 청와대지점[35]으로 현재에 이르고 있다. 이 시절, 실제 관리를 담당했던 효자동지점 대여금고는 정치권 비자금 사건에 단골로 등장해 유명세를 타기도 했다. 1915년 3월 경성부청과 금고 계약을 맺은 것을 시작으로, 조선상업은행 시절부터 100년 넘게 서울특별시청 및 25개 구청[36]의 금고 은행이었다.[37] 그렇다 보니 서울특별시청 관련 관공서, 각 자치구청 및 산하시설, 서울시립대학교에 우리은행 지점이나 하다못해 1~2대 정도는 ATM이 빠짐없이 존재한다. 서울특별시청 지방세 납부도 편리하게 처리할 수 있다. 그런데 2014년 말 용산구청이 구금고를 분리하고 1금고를 신한은행에 맡기면서 우리은행의 구금고 독점은 깨졌다. 용산구를 비롯해 강남, 노원, 양천구청의 일부 세금[38]도 서울특별시청 ETAX 납부가 불가능해졌다. 이후 2019년 서울 시금고에 복수금고제가 도입되었고, 1금고는신한은행이, 2금고는 우리은행이 맡게 되면서 지난 103년간의 우리은행 독점이 깨졌다. 기사 다만 시청을 제외하고는 기존 우리은행 지점/영업점들이 일순간에 신한은행으로 변경되거나 하진 않았다. 서울특별시청의 시금고 외에도, 부산광역시청의 제1금고를 1936년부터 2000년까지 64년 간 우리은행이 맡아 온 적이 있다. 이유인즉슨 부산은행이 자금력이 떨어진다는 판단으로 제1금고를 맡기지 않았다고. 지방자치제 실시 이전에 제일은행이 전라북도의 도금고를 맡았던 사례와 비슷하다.`
  + `한국상업은행 시절 부산시청의 OCR 전산도 구축해 주었다. 한빛은행 시절인 2001년부터 부산은행이 부산광역시청의 제1금고로 선정되어 현재에 이르고 있다. 한일은행 시절부터 주요 대학교 거래를 많이 해온 덕분인지, 우리은행 홈페이지에 따르면 서울대학교, 포항공과대학교, 연세대학교, 서강대학교, 성균관대학교, 서울시립대학교, 단국대학교 등 국내 대학에 최다 입점해 있으며,[39] 54개 대학(학력인정학교, 전문대학, 카이스트와 지스트같은 특수대학 포함, 분교 따로 계산)의 학생증을 만들어 주고 있다 한다.[40] 2019년 신입학생부터는 서울대학교가 기존 농협과의 제휴를 종료하고 우리은행과 제휴함으로써 기존에 서울대학교 학생증으로 발급하던 S Card 겸용 체크카드는 위비뱅크 어플리케이션으로 발급 가능하다. 기존 S Card 농협체크카드 사용자는 그대로 사용 가능하나 재발급시에는 우리체크카드로 발급된다. 한국상업은행 시절부터 천주교 서울대교구를 중심으로 한국 가톨릭과도 관계가 밀접하다. 가톨릭대학교와 서강대학교 안에도 우리은행 출장소가 있으며 성당과 밀접한 개별 신협 등이 아니라면, 거의 대부분의 교구와 교회들 재정을 우리은행을 통해 관리한다. 가톨릭 문학상 기금을 출연하거나 가톨릭 신자들의 교적관리 시스템인 '전국통합양업시스템'을 지원하고 있다. 덕분에 우리은행에서는 교무금 통장도 발행하고, 텔레코드 221은 명동성당 헌금이체, 222는 천주교회 헌금이체에 할당해 놓았다. 다만 성당 사무실에서 이거 쓰지 말라고 하면 교무금통장 들고 사무실에서 교무금을 내야 한다. 따라서 명동성당 내 가톨릭회관지점도 중요한 지점이며, 해당 지점에는 원칙적으로 가톨릭 신자들만 발령낸다. 우리카드에도 "우리성당 체크카드"가 있다. 철도청 말기 시절부터 공사화된 이후의 한국철도공사도 우리은행이 주거래다. KTX 이전 시대에는 조흥은행이었으나 2003년 11월 우리은행과 철도청이 주거래 계약을 맺었고 KTX 개통과 동시에 조흥은행의 철도 승차권 발매기가 모두 사라졌다. 대전역 옆 철도타워에 지점이 있다.[41] 이에 우리은행 일부 지점에서 여객열차 승차권을 발권하였으나 현재는 사라졌다. 서울역에 가 보면 인천국제공항철도 서울역을 포함하여 주변에 우리은행과 관련된 것들이 정말 많이 보인다.[42] 참고로 서울역 서부출구의 서울역지점은 한국상업은행 시절부터 한국철도공사 주거래와는 관계없이 존재해 왔다. 지방은행들, 보고 있나? 그 외에 특수지점으로는 국방부출장소[43], 공항금융센터[44], 국방과학연구소출장소, 금융감독원지점[45][46] 서울특별시, 인천광역시, 경기도에서 근무하는 사회복무요원들의 월급 통장은 주로 우리은행, 국민은행, 신한은행 중 하나다.[47] 한국장학재단도 주거래가 우리은행인 듯하며, 대구광역시 동구 신암2동으로 이전하면서 신암2동 사옥 1층에 한국장학재단출장소를 새로 열었다. 그러나 불과 1년 만에 한국장학재단출장소를 폐쇄하고 신암동지점과 통합했다. 2018년 12월부터는 로또 당첨금을 우리은행에서 받을 뻔 했지만 복권수탁을 맡은 동행복권 컨소시엄과 협의 과정에서 의견을 좁히지 못해 실패해버리고 말았다.[48][49] 10.4. 금융권 최초[편집] 대한민국 최초로 ActiveX를 사용하지 않는 오픈뱅킹 서비스를 시작했다! 게다가 W3C의 웹 표준 인증도 따냈다!! ActiveX를 아주 사용하지 않는건 아니지만 사용한다고 해도 방화벽이나 인증서 로그인시 필요한 정도로 그치고있다.[50] 단 공인인증서 말고도 아이디와 비번으로도 계좌이체(이체시 공인인증서로 전자서명은 필요하다) 같은 모든 은행업무를 볼 수 있다. 하지만 2011년 연말에 국민은행이 오픈뱅킹 기반으로 기존 인터넷뱅킹을 싹 옮겼으니... 북한에 지점을 낸 최초의 은행이다.[51][52] 개성공단 내에 우리은행 지점이 있으며, 환전이나 K-Cash 업무를 볼 수 있는 듯. 나름 해외 지점이라고 현지인 직원을 채용했다고 한다. 개성공단의 특성상 달러로 거래하는 지점이지만, 2016년 2월 11일 갑작스러운 개성공단 폐쇄 조치에 따른 북한의 기습적인 퇴거 조치로 인해 달러를 챙겨 가는 긴박한 작전이 벌어졌다. 내려온 후 회현사거리 본점에 임시 창구를 마련했다.2019년 현재까지 회현동 본점 건물 안에 임시 지점을 만들어 계속 운영하고 있다. 2015년 5월 26일, 은행권 중에서는 최초로 모바일 전문은행 '위비은행'(Wibee, 为飞)위비뱅크(Wibee Bank)를 설립하였다.[53] 설립의 주된 목적은 인터넷전문은행 설립에 앞서 운영경험 축적과 수익모델 검증을 위함이다.[54] 상품 중 중금리 서민금융 상품인 '위비 모바일 대출'은 출시 4주내에 90억원의 실적을, 8월 19일까지는 260억원의 실적을 냈다.[55] 폭망 아니면 저축은행 쓰지말고 또한 위비톡이라는 우리은행 특화 메신저 앱을 내놓았다. 2017년 출시한 음성인식 AI뱅킹인 소리(SORI)와 로보어드바이저 우리로보알파 역시 국내 금융권 최초다. 2015년 4월, 은행권 최초 '인터넷 전용 방카슈랑스 상품' 판매. 10.5. 교통카드[편집] 우리은행의 ATM에서는 캐시비, 티머니, 심지어 레일플러스까지 충전할 수 있어서 충전의 폭이 넓다. 캐시비를 충전할 수 있는 은행 ATM들 중 유일하게 1,000원 단위로 충전할 수 있지만, 1만원 이상부터 받기 때문에 1만원 밑의 금액으로는 캐시비를 충전할 수 없다. 티머니와 레일플러스는 ATM에서 1만원 단위로만 충전할 수 있다. 본래 티머니, 유패스만 충전되었고 캐시비는 2013년 12월에 추가됐다. 교통카드 충전 속도가 꽤 빠르게 느껴지지만 ATM 고장시의 연락처와 함께 주민등록번호를 요구한다는 건 옥의 티. 2014년 8월 7일부터 주민등록번호 수집의 전면 금지에 따라 생년월일 6자리만 입력한다. 다만, 티머니를 우리은행 ATM에서 현금으로 충전할 때, 5만원이 넘는 금액을 충전하려면 5만원을 우선 충전한 후 남은 금액을 재차 충전해야 한다.[56] 따라서 신한은행, 우체국 ATM 충전보다 깔끔하지 못하다. 시중 은행들의 ATM들 중 유일하게 유패스를 충전할 수 있었지만, 2014년 9월 1일 유패스가 완전히 단종되어 의미가 완전히 없어졌다. 코레일이 우리은행과 협약을 맺어 코레일에서 2014년 10월 25일에 출시한 전국호환 교통카드인 레일플러스의 ATM 충전으로 대체하면서 유패스의 충전은 삭제됐고, 2014년 12월 26일부터 레일플러스의 ATM 충전 서비스를 정식으로 개시한다. 2014년 6월 수도권에 캐시비 전국호환 교통카드가 본격적으로 런칭된 이후 우리은행에서는 현금카드에다가 전국호환형 캐시비를 장착하여 내놓았....는데 지금은 전산망과 카드 자재 문제[57]로 현재는 발급이 중단되었고 8월 1일에 발급을 재개했다. 8월 29일까지 무료로 발급이 가능했으나 청소년용 자재는 대부분 지점에서 8월 25일부터 발급이 개시되었다(...)발급받으라는거니 말라는 거니. 단, 대전광역시 등 일부 캐시비를 아예 받지 않는 지역에서는 발급이 제외되니, 다른 지역으로 가서 발급받을 것. 그래도 스마트원 티머니 현금카드를 수도권에서만 발급받을 수 있는 신한은행보다 발급 지역이 많다. 캐시비가 달리지 않은 사양에는 K-Cash가 달린다. 신한은행처럼 일부 ATM에서는 RF 센서가 있어도 RF 센서에서 교통카드를 인식하지 않고 카드를 삽입해 달라는 메시지가 뜨는 경우가 있다.`,
];

const sampleQuestions = [
  [
    '폭발은 언제 발생 했어요?',
    '푹발은 어디에서 일어 났습니까?',
    '다친 노동자는 몇 명입니까?'
  ],
  ['어디에서 캐시비 충전할 수 있어?']
];

const useStyles = makeStyles(theme => ({
  disabledInput: {
    color: theme.palette.text.primary,
  },
}));

export default function MachineComprehension({models}) {

  const classes = useStyles();

  const [ translateY, setTranslateY ] = useState(0);
  const [ originalData, setOriginalData ] = useState('');
  const [ questions, setQuestions ] = useState([]);
  const [ question, setQuestion ] = useState();

  const [ result, setResult ] = useState('');
  const [ processing, setProcessing ] = useState(false);

  useEffect(() => {
    const handler = throttle(handleScroll, 10, { trailing: false});

    window.addEventListener('scroll', handler);

    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleScroll = () => {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop){
      console.log('scroll up', st - lastScrollTop);
    } else {
      console.log('scroll down', lastScrollTop - st);
    }
    savedTranslate += (lastScrollTop - st)/2;
    setTranslateY(savedTranslate);

    lastScrollTop = st <= 0 ? 0 : st;
  };

  const requestForAnswer = async () => {
    setProcessing(true);
    setResult('');

    try{
      const data = {
        bertId: 'FinBERT_v2',
        Context: originalData,
        question
      };

      const res = await fetch(`/api/machine_comprehension?data=${originalData}&question=${question}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const resData = await res.json();

      const sortedData = map(orderBy(resData, ['probability'], ['desc']), data => `${data.text} (${(data.probability * 100).toFixed(2)}%)`);

      setResult(reduce(sortedData, (result, data) => {
        result += data + '\n\n';
        return result; 
      }, ''));
    }catch(ex){
      console.log(ex);
    }

    setProcessing(false);
  };

  return (
    <div className="container">
      <DemoPage active='machine'>
        <div style={{position: 'relative'}}>
          <div
            style={{
              backgroundColor: '#6f42c1',
              color: 'white',
              padding: '55px 0',
              width: '100%',
              position: 'fixed',
              top: 64, left: 0,
              zIndex: -1,
              height: 500,
              transform: `translateY(${translateY}px)`
            }}
          >
            <div className='grid'>
                <div style={{flex: 1, marginRight: 20}}>
                    <h1>UDP Comprehensive Chatbot</h1>
                    <p>A messenger marketing solution</p>
                </div>
                <div style={{flex: 1}}>
                  <img src='/img/annotation/NER.gif' style={{width: '100%'}}/>
                </div>
            </div>
          </div>

          <div id='content' style={{marginTop: 440, backgroundColor: 'white', padding: '55px 0'}}>
          <div style={{padding: '0 20%', marginTop: 55}}>
                <h1>How it works</h1>
                <p>UDP Chatbot aims to serve various domains separately. This means that UDP Chatbot can comprehend a domain knowledge through input text regarding the domain. If you need to deploy UDP Chatbot for your particular business, we just input its information regarding your products, services, or any content that Chatbot is desired to comprehend and answer your customers.</p>
                <p>To demonstrate the ability to comprehend an input knowledge, we built a Machine Reading Comprehension system as web application where we can input knowledge (so-called context) in the form of sentences in text format. And we can also input questions related to the input context. The system will answer our question based on the input context.</p>
          </div>

             <div style={{padding: '0 20%', marginTop: 55}}>
              <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
                <h2 style={{margin: 0}}>Input text</h2>
                <FormControl variant='outlined' style={{width: 200, marginLeft: 24}}>
                  {/* <InputLabel id="demo-simple-select-label">English</InputLabel> */}
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value='ko'
                    style={{height: 40}}
                  >
                    {/* <MenuItem value='en'>English</MenuItem> */}
                    <MenuItem value='ko'>한국어</MenuItem>
                    {/* <MenuItem value='vi'>Tiếng Việt</MenuItem> */}
                  </Select>
                </FormControl>
                <Button
                  style={{marginLeft: 'auto', marginRight: 20}}
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    setOriginalData(sampleTexts[0]);
                    setQuestions(sampleQuestions[0]);
                    setQuestion();
                  }}
                >
                  Example 1
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    setOriginalData(sampleTexts[1]);
                    setQuestions(sampleQuestions[1]);
                    setQuestion();
                  }}
                >
                  Example 2
                </Button>
              </div>
              <TextField
                placeholder='Add a sample text'
                variant='outlined'
                style={{width: '100%'}}
                multiline={true}
                rows={5}
                value={originalData}
                onChange={e => setOriginalData(e.target.value)}
              />

              {/* <TextField
                placeholder='Type a question'
                variant='outlined'
                style={{width: '100%', marginTop: 12}}
                value={question}
                onChange={e => setQuestion(e.target.value)}
              /> */}

              <Autocomplete
                key={originalData}
                options={questions}
                value={question}
                onChange={(e, value) => setQuestion(value)}

                inputValue={question}
                onInputChange={(event, newInputValue) => {
                  setQuestion(newInputValue);
                }}
        
                style={{ width: 300 }}

                renderInput={(params) => <TextField
                  {...params}
                  placeholder='Select a question'
                  variant='outlined'
                  style={{width: '100%', marginTop: 12}}
                />}
              />

              <div style={{textAlign: 'right', marginBottom: 30}}>
                <Button
                  variant='contained'
                  color='secondary'
                  style={{margin: '10px 0', minWidth: 90}}
                  onClick={requestForAnswer}
                  disabled={processing}
                >
                  {
                    processing ?
                    <CircularProgress size={24} color='white' />
                    :
                    'submit'
                  }
                </Button>
              </div>
              
              <h2 style={{margin: '0 0 16px 0'}}>Result</h2>
              <TextField
                placeholder='Input text above or try analyzer with our example'
                variant='outlined'
                style={{width: '100%'}}
                multiline={true}
                rows={10}
                disabled
                value={result}
                InputProps={{ classes: { disabled: classes.disabledInput } }}
              />
            </div>  

            <div className='grid-column'>
              <div style={{flex: 1, marginRight: 20}}>
                  <h1>Features</h1>
                  <p></p>
              </div>
              <div style={{flex: 1}}>
                <img src='/img/annotation/Chatbot_features.PNG' style={{width: '100%'}}/>
              </div>
            </div>

            <div className='grid-column'>
              <div style={{flex: 1, marginRight: 20}}>
                  <h1>Architecture</h1>
                  <p></p>
              </div>
              <div style={{flex: 1}}>
                <img src='/img/annotation/Chatbot_Architecture.PNG' style={{width: '100%'}}/>
              </div>
            </div>
          </div>
        </div>
      </DemoPage>

      <style jsx>{`
        .container {
          min-width: 100vw;
          min-height: 100vh;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        #content p {
            line-height: 2.0
        }

        h1 {
          margin-top: 0
        }

        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: 'Open Sans', sans-serif;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          color: #777;
          font-weight: 400;
        }

        .grid {
          display: flex;
          flex-direction: row;
          padding: 0 20%;
        }

        .grid-column {
          display: flex;
          flex-direction: column;
          padding: 0 20%;
          margin-top: 55px
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

// export async function getStaticProps() {
//   const res = await fetch('', {
//     headers: {
//       'Authorization' : `Basic ${Buffer.from('twin:twin', 'utf-8').toString()}`
//     }
//   });
//   const data = await res.json();

//   return {
//     props: {
//       models: data
//     }
//   }
// }
