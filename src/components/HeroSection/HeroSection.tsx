import ClientComponent from './ClientComponent';
import { section2 } from './ServerComponent';

const HeroSection = () => {
    return (
        <ClientComponent section2={section2} />
    );
};

export default HeroSection
