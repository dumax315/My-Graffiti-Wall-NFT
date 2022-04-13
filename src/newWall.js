import Minter from './Minter'
import WallCollectionViewer from './viewer'


function newWallPage() {
  return (
		
    <div className="main">
      <Minter></Minter>
			<WallCollectionViewer></WallCollectionViewer>
    </div>
  );
}

export default newWallPage;
