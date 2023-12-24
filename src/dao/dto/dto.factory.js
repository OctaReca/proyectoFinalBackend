class DTOFactory {
    createUserDTO(user) {
        console.log("User data before creating DTO in factory:", user);
        return new this.createUserDTO(user);
    }
}

export default DTOFactory;