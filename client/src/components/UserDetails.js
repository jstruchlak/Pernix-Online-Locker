const UserDetails = ({ detail }) => {
    return (
        <div className="user-details">
            <h4>{detail.fullName}</h4>
            <p><strong>Date of Birth</strong>{detail.dob}</p>
            <p><strong>Role</strong>{detail.aboutMe}</p>
            <p><strong>{detail.createdAt}</strong></p>
        </div>
    )
}

export default UserDetails