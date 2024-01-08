export default function MovieCard(props) {
    return (
        <div className='moviecard'>
            <h2>{props.rank}</h2>
            <img width='300' src={props.image}/>
            <h3>{props.title}</h3>
        </div>
    );
}