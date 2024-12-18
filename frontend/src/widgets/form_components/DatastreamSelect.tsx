import { DATASTREAM, datastreams } from "../../shared-types";
import GenericSelect from "./GenericSelect";

interface DatastreamSelectProps {
    datastream: DATASTREAM,
    setDataStream: (d: DATASTREAM) => void;

};

const DatasteamSelect: React.FC<DatastreamSelectProps> = ({datastream, setDataStream}) => {
    return <GenericSelect value={datastream} options={datastreams} prompt="Select Datastream" setValue={setDataStream}/>
}

export default DatasteamSelect;