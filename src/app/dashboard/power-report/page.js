import PowerReportListView from "src/components/power-report/view/PowerReport-list-view";



export const metadata = {
    title: 'Dashboard: Power Report',
};


const page = () => {
    return (
        <div>
            <PowerReportListView />
        </div>
    )
}

export default page
