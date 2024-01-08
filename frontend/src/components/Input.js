import {motion, AnimatePresence} from 'framer-motion';

export default function Input(props) {
    return (
        <div className={props.classes}>
            <AnimatePresence>
                {props.invalid && <motion.p className='label center' initial={{height: 0, opacity: 0}} animate={{height: 16, opacity: 1}} exit={{height: 0, opacity: 0}}>{props.message}</motion.p>}
            </AnimatePresence>
            <input type={props.inputType} placeholder={props.placeholder} value={props.value} onChange={props.onChange} onBlur={props.onBlur}/>
        </div>
    );
}