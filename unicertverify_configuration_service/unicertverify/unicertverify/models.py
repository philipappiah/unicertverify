

from ast import mod
from django.db import models
from django.contrib.postgres.fields import ArrayField



class Issuer(models.Model):
    address = models.CharField(max_length=255,primary_key=True)
    admin = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    website = models.URLField(max_length=255)
    type = models.CharField(max_length=255, null=True)
    location_address = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    zipcode = models.CharField(max_length=255)
    telephone = models.CharField(max_length=255)
    trustees = ArrayField( models.CharField(max_length=500), null=True)
    size = models.CharField(max_length=255)
    docs = ArrayField( models.CharField(max_length=500), null=True)
    logo = models.CharField(max_length=255, null=True, blank=True)
    terms_agreed = models.BooleanField(default=False)
    gdpr_agreed = models.BooleanField(default=False)
    privacy_agreed = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(null=True,blank=True)
    
    def __str__(self) -> str:
        return f"{self.address} | {self.name} | {self.email}"




    

class Applicant(models.Model):
    address = models.CharField(max_length=255, primary_key=True)
    fullname = models.CharField(max_length=255)
    
    
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=255, null=True, blank=True)
    is_trustee = models.BooleanField(default=False)
    issuer = models.CharField(max_length=255, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    position = models.CharField(max_length=255,null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    modified_at = models.DateTimeField(null=True,blank=True)
    


class Trustee(models.Model):
    issuer = models.ForeignKey(
        Issuer, null=True, blank=True, on_delete=models.SET_NULL
    )
    trustees = ArrayField(models.CharField(max_length=100),default=list, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(null=True,blank=True)





class Certificate(models.Model):
    address = models.CharField(max_length=255, primary_key=True)
    applicant = models.ForeignKey(
        Applicant, null=True, blank=True, on_delete=models.SET_NULL
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(null=True)
    
    is_private = models.BooleanField(default=True)
    is_valid = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.address} | {self.is_private} | {self.is_valid}"




class ProofRequest(models.Model):
    reference = models.CharField(max_length=255, primary_key=True)
    applicant = models.ForeignKey(
        Applicant, null=True, blank=True, on_delete=models.SET_NULL
    )
    certificate = models.ForeignKey(
        Certificate, null=True, blank=True, on_delete=models.SET_NULL
    )
    issuer = models.ForeignKey(
        Issuer, null=True, blank=True, on_delete=models.SET_NULL
    )
 
    completion_year = models.CharField(max_length=255,null=True, blank=True)
    completion_month = models.CharField(max_length=255,null=True, blank=True)
    deg_type = models.CharField(max_length=255,null=True, blank=True)
    deg_name = models.CharField(max_length=255,null=True, blank=True)
    college = models.CharField(max_length=255,null=True, blank=True)
    course = models.CharField(max_length=255,null=True, blank=True)
    major = models.CharField(max_length=255,null=True, blank=True)
    deg_class =  models.CharField(max_length=255,null=True, blank=True)
    minor = models.CharField(max_length=255,null=True, blank=True)
    message = models.CharField(max_length=500,null=True, blank=True)
    student_num = models.CharField(max_length=255,null=True, blank=True)
    date_awarded = models.CharField(max_length=255,null=True, blank=True)
     
    
    ipfs_hash = models.CharField(max_length=255,null=True, blank=True)
    signers = ArrayField(models.CharField(max_length=500), default=list, null=True, blank=True)
    affirmation_statement = models.TextField(max_length=1000,null=True, blank=True)
    has_affirmation = models.BooleanField(default=False)
    required_signers = models.IntegerField(default=0, null=True, blank=True)
    no_of_signers = models.IntegerField(default=0, null=True, blank=True)
    tx_hash = models.CharField(max_length=500, null=True, blank=True)
    signatures = ArrayField(models.CharField(max_length=500), default=list, null=True,blank=True)
    data_hash = models.CharField(max_length=500, null=True, blank=True)
    status=models.CharField(max_length=255,null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(null=True)



class UniversityProofSchema(models.Model):
    context =  ArrayField(models.CharField(max_length=500), default=list, null=True)
    type = models.CharField(max_length=255,null=True, blank=True)
    issuer = models.ForeignKey(
        Issuer, null=True, blank=True, on_delete=models.SET_NULL
    )
    applicant = models.ForeignKey(
        Applicant, null=True, blank=True, on_delete=models.SET_NULL
    )
    degreeType = models.CharField(max_length=255,null=True)
    degree_name = models.CharField(max_length=255,null=True )
    course_name = models.CharField(max_length=255,null=True )
    college_name = models.CharField(max_length=255,null=True, blank=True )
    degreeClass = models.CharField(max_length=255,null=True, blank=True )
    grade = models.CharField(max_length=255,null=True, blank=True )
    major = models.CharField(max_length=255,null=True, blank=True )
    minor = models.CharField(max_length=255,null=True, blank=True )
    startDate = models.DateField(null=True, blank=True )
    completionDate = models.DateField(null=True, blank=True ),
    affirmationStatement = models.TextField(max_length=1000,null=True, blank=True )




class PendingProofRequest(models.Model):
    trustee = models.ForeignKey(
        Applicant, null=True, blank=True, on_delete=models.SET_NULL
    )
    pending_requests = ArrayField(models.CharField(max_length=100),default=list, null=True)



class ViewRequest(models.Model):
    reference = models.CharField(max_length=255, primary_key=True)
    certificate = models.ForeignKey(
        Certificate, null=True, blank=True, on_delete=models.SET_NULL
    )
    owner_approved = models.BooleanField(default=False)
    confirmations = models.IntegerField(default=0)
    request_address =  models.CharField(max_length=255)
    request_Status = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(null=True)

    def __str__(self) -> str:
        return f"{self.owner_approved} | {self.confirmations} | {self.request_address} | {self.request_Status}"






class PendingViewRequest(models.Model):
    applicant = models.ForeignKey(
        Applicant, null=True, blank=True, on_delete=models.SET_NULL
    )
    pending_requests = ArrayField(models.CharField(max_length=100),default=list, null=True)